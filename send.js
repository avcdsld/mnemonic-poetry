const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const NETWORK = bitcoin.networks.testnet;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SOURCE_ADDRESS = 'SOURCE_ADDRESS';

const FEE_RATE = 16.646; // sat/vB

const DESTINATION_ADDRESSES = fs.readFileSync('addresses.txt', 'utf-8')
    .split('\n')
    .filter(line => line.includes(':'))
    .map(line => line.split(':')[1].trim());

async function sendBitcoin() {
    const keyPair = bitcoin.ECPair.fromWIF(PRIVATE_KEY, NETWORK);
    const txb = new bitcoin.TransactionBuilder(NETWORK);

    const utxos = await axios.get(`https://testnet-api.smartbit.com.au/v1/address/${SOURCE_ADDRESS}/utxo`);
    
    if (!utxos.data || !utxos.data.unspent) {
        throw new Error('UTXO の取得に失敗しました。');
    }

    const utxo = utxos.data.unspent[0];
    txb.addInput(utxo.txid, utxo.n);

    for (const address of DESTINATION_ADDRESSES) {
        txb.addOutput(address, 1000);
    }

    const estimatedTxSize = 68 + (31 * (DESTINATION_ADDRESSES.length + 1));
    const fee = Math.ceil(estimatedTxSize * FEE_RATE / 1000) * 1000;

    const change = utxo.value_int - (DESTINATION_ADDRESSES.length * 1) - fee;
    txb.addOutput(SOURCE_ADDRESS, change);

    txb.sign(0, keyPair, null, null, utxo.value_int);

    const rawTx = txb.build().toHex();
    const result = await axios.post('https://testnet-api.smartbit.com.au/v1/blockchain/pushtx', {
        hex: rawTx
    });

    console.log('Tx ID:', result.data.txid);
}

sendBitcoin().catch(console.error);
