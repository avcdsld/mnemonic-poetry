const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

const bip32 = BIP32Factory(ecc);

const mnemonics = [
    'けむし ひくい りそう ひなまつり おおい たんまつ きどく ひこうき たんご らくさつ いきおい るいさい',
    'つよい　まろやか　さんさい　けむり　つのる　てんめつ　たいみんぐ　ひしょ　ひつよう　こてん　おもう　きほん',
    'げねつ　はっこう　ほおん　うちき　かいぞうど　いちど　たんてい　しむける　むげん　ばかり　まもる　げきは',
    'でんわ　がちょう　ちひょう　にいがた　こもち　にんぷ　のやま　そそぐ　おしえる　しはつ　きょうりゅう　そいとげる',
    'きゃく　ふちょう　うっかり　きつえん　かいぞうど　たると　ろんぎ　ならう　ごうい　さよう　せいかつ　げきげん',
    'こやま　そせい　せぼね　そんしつ　ゆたか　さゆう　おんだん　いりぐち　ていさつ　にまめ　つごう　にまめ',
    'さんせい　だんろ　ぬかす　さほう　こんわく　みすえる　こんき　めざす　はんてい　おこなう　うちがわ　ろうそく',
    'とおく　とめる　こいびと　ほうもん　せんちょう　ていねい　さいかい　さほう　せんれい　みつける　そふぼ　えんちょう',
    'くちこみ　れんらく　むらさき　けいけん　すきま　きおく　しょどう　まかせる　こくはく　つみき　きちょう　むしあつい',
    'ほうこく　けしょう　たこく　ばいか　しょっけん　せんとう　おもたい　はっちゅう　さんま　としょかん　くせん　ひらがな',
    'しなぎれ　じゆう　へきが　ちそう　ふめん　みがく　げきやく　もくてき　さびしい　たおれる　ろんぶん　たりょう',
    'のばす　とたん　あてはまる　てはい　ぎっちり　がいへき　じゅうしょ　はづき　ひっす　ぱそこん　えがお　そとがわ',
    'いたずら　ねんいり　ぐうたら　ないす　とさか　てんぼうだい　えいきょう　ふとん　げきやく　ひいき　だじゃれ　むせる',
    'えんそく　いない　ざいえき　かわら　はおる　ばあい　あたる　ねったいぎょ　ねこむ　れいぼう　そせい　のせる',
    'へらす　しゃしん　さべつ　よくぼう　ふはい　ちりょう　でんりょく　よくせい　みがく　ひっこし　ぜんぽう　くうふく',
    'てきとう　けおとす　うらない　けいろ　ひそむ　いっせい　ごかん　これくしょん　ぴったり　まんなか　さこつ　いっそう',
    'てんし　いもたれ　こうかん　みかた　こつこつ　やたい　まんなか　ひんぱん　たなばた　しすう　かんけい　きこく',
    'げきやく　ちひょう　てんいん　にかい　よねつ　ねんまつ　いてん　にんそう　るいけい　あんない　かんち　そげき',
    'たたかう　こうおん　さゆう　まこと　あいこくしん　はんえい　そんざい　たまご　さよう　ひたる　やそう　じゅんばん',
    'こたい　ろくが　われる　ぜんりゃく　ぎじにってい　とおい　がぞう　きほん　たよる　たかい　さんすう　かいしゃ',
    'われる　きびしい　げきか　よどがわく　さいせい　あこがれる　ほしょう　せきゆ　あたえる　くみたてる　うもう　じどう',
    'てれび　ちわわ　ひそか　りんご　とさか　でんわ　はさみ　きつね　しはん　しいく　てぶくろ　そぼろ',
    'だっきゃく　ふりこ　りゆう　きおち　そむりえ　たれんと　ひろき　おまいり　るすばん　ごまあぶら　さんすう　なめる',
    'ほたて　なつやすみ　にってい　てつづき　あんぜん　そなえる　ますく　ほうほう　かなざわし　ちょうし　しゃけん　まよう',
    'つもり　しゃざい　みんぞく　かかえる　たすける　くたびれる　くやくしょ　たんのう　てんとう　とっきゅう　なわばり　せっさたくま',
    'うかぶ　いそがしい　ずいぶん　げいじゅつ　たいえき　けいろ　いだい　あひる　いっしゅん　しんりん　ほしょう　そなた',
    'けんこう　きどく　ふすま　こねこね　でんわ　すいえい　でんち　すぼん　さんきゃく　むせる　しなぎれ　ねんおし',
    'おだやか　そうめん　あつまり　はいせん　ほくろ　くどく　けんない　ぴっちり　いずれ　ふこう　へいたく　つうはん',
    'まわす　ちめいど　のべる　さんらん　かんそう　ひんけつ　ことり　こんなん　みらい　たいよう　おおう　がいこう',
    'ちしき　うどん　きうい　ずひょう　ろてん　てふだ　えほうまき　ほこう　れきし　のがす　こうりつ　せんゆう',
    'ひんぱん　ぶんせき　ざんしょ　えんかい　ふとん　きかんしゃ　こせき　おめでとう　はっちゅう　うろこ　ふとん　たやすい',
    'こしつ　つまらない　たぬき　ぱんつ　はんこ　いがく　きなが　さんち　いへん　さつまいも　しのぐ　といれ',
    'さいしょ　おどろかす　こんまけ　ちひょう　しゃりん　つうはん　ひよう　もくし　あんい　ていこく　ざんしょ　のらいぬ',
    'さくし　おくりがな　つみき　みつかる　しゃそう　ちきゅう　しゃいん　そめる　きあい　たんけん　とつにゅう　ちりがみ',
    'いつか　むやみ　なつやすみ　ふえる　きぞん　ゆらい　けいこ　せはば　みねらる　そうき　りょくちゃ　せつりつ',
    'つめたい　でっぱ　ひんぱん　けなげ　せまる　いこつ　そせん　ほしい　いもたれ　ならう　きらい　さといも',
    'はんだん　わらう　さっきょく　ひかり　ほんき　ふおん　しょもつ　あおぞら　うこん　はにかむ　そぼろ　ばあい',
    'ここのか　ぜんご　せきゆ　げんぶつ　こんぽん　たんにん　したみ　みわく　いはつ　まんぞく　とかい　はなび',
    'くさる　げこう　そだてる　せんめんじょ　おやつ　とのさま　せもたれ　たんてい　おしえる　せんゆう　あみもの　ごうまん',
    'じゆう　たくさん　うしろがみ　かようび　しゃこ　だっしゅつ　すふれ　いけばな　むすこ　せかいかん　はっぽう　ちたい',
    'はっけん　かがし　さいてき　くうき　ひんかく　いちじ　むしろ　さとる　うなじ　やける　むかし　ちらみ',
    'ろうじん　あさひ　せんねん　てまえ　だっこ　ごまあぶら　へんさい　りょこう　こむぎこ　にっき　おいかける　むかう',
    'ずっしり　ほめる　はいすい　いせえび　おいつく　ぽちぶくろ　ぐこう　なのか　ふよう　せんか　かようび　のぞむ',
    'さんま　そめる　はたん　しつもん　おやゆび　つごう　ばいばい　おとしもの　けおりもの　しばかり　ねんちゃく　うさぎ',
    'ちるど　しゅらば　まねく　おやつ　はけん　いずみ　とさか　いちぶ　がんばる　そげき　くしょう　ぶんせき',
    'おんどけい　しゃっきん　くどく　みかた　こたつ　ひっし　こりる　そうめん　けなす　せけん　はっさん　けとる',
    'さんさい　えんぜつ　みなと　ききて　ねっしん　むすぶ　くつした　せんとう　うれゆき　からい　つくる　げすと',
    'せんめんじょ　くさばな　ずさん　すいか　すばらしい　じだい　はっくつ　やよい　ふうせん　みんか　おおどおり　ひつじゅひん',
    'いきもの　ごうけい　かぶか　すずしい　じぶん　きはく　はんぶん　せんゆう　ずほう　しゅっせき　しょもつ　きむずかしい',
    'きくらげ　たいおう　えんしゅう　ふうけい　たいふう　くすのき　ぱそこん　うつくしい　みんか　さいかい　もらう　へいそ',
    'ひつじゅひん　にんてい　たすける　ぐんて　なわとび　しちりん　かいさつ　だいすき　めやす　すいとう　つなみ　さんそ',
    'だっこ　しんちく　せたい　けつあつ　つわもの　ごうい　さべつ　ようじ　たいねつ　むろん　あかちゃん　こふう',
    'あきる　あおぞら　けしごむ　にんしき　こうつう　あつかう　ぴんち　くれる　さむけ　がんばる　はあく　おこる',
    'きふく　てんき　こやま　いわゆる　いぜん　やそう　まんが　かおり　まなぶ　たしざん　しひょう　あんぜん',
    'えんかい　ぜんぶ　ますく　ひたる　はんぶん　そうご　そせん　しゃれい　らいう　ふくぶくろ　たとえる　ととのえる',
    'いない　りょこう　たんにん　れんあい　めいそう　うけとる　かくご　のぞむ　でんわ　だんれつ　らしんばん　みわく',
    'ひまわり　はいそう　きびしい　けんとう　はっしん　おだやか　いじょう　とらえる　しょくたく　つねづね　りょこう　はわい',
    'ぱんつ　ねんかん　にんよう　にんげん　あじわう　にまめ　そだてる　うなる　とうむぎ　ふつう　にんたい　たえる',
    'げいじゅつ　うかぶ　はやし　うちがわ　おしいれ　いやがる　そぼく　こぜん　ほいく　ひいき　たたかう　きちょう',
    'こちょう　つけね　すける　うおざ　へいせつ　たもつ　だんろ　ゆらい　けつろん　たそがれ　みすえる　さかな',
    'こわもて　つるぼ　にんげん　ひんそう　あらすじ　すずしい　ろくが　ほうそう　いほう　けつじょ　きのう　やぶる',
    'たいわん　うえる　けみかる　てんない　かんち　つねづね　てんさい　うれしい　さよく　けんてい　まわる　こいぬ',
    'あひる　はんえい　たなばた　さんこう　のんき　あさひ　こもの　がいらい　のりゆき　てちょう　ふりる　あわせる',
    'よくぼう　にげる　かたい　ねむたい　ちしき　かんけい　けんみん　なれる　つるぼ　かいふく　あんまり　かくご',
    'しゅらば　ゆれる　えがく　ねんぴ　さいせい　らいう　いへん　すあげ　あつめる　すっかり　そむく　そしな',
    'はやし　げきだん　かまう　つづく　とそう　らぞく　しゃせん　おんしゃ　すいえい　いたずら　きむずかしい　さみしい',
    'やせる　たいねつ　きせい　ごはん　はっぴょう　ほけん　はやい　ひりつ　すぼん　しまる　おとしもの　きんようび',
    'ていぼう　せんく　るいさい　いっせい　めいれい　きわめる　りょうり　あまい　むせる　たんけん　すてる　はいれつ',
    'ゆちゃく　しゅらば　そっけつ　しなもの　さっきょく　せきゆ　みせる　きらく　えんげき　めいきょく　ちゃんこなべ　だいすき',
    'そんけい　こりる　ちえん　こけい　ふさい　しゃけん　ねいろ　ひだり　はんえい　るりがわら　わしつ　たいけん',
    'にりんしゃ　おおい　せいよう　ねぐせ　ぎろん　ぐこう　むせる　ゆそう　だいがく　かいぜん　のがす　さかみち',
    'せぼね　まんなか　うよく　えんそく　でぬかえ　ほこる　いさん　よごれる　そえん　うっかり　ぬめり　ひるま',
    'せつぶん　のこす　くうぼ　はんおん　はっちゅう　にんたい　おんけい　しんりん　けつあつ　くなん　さらだ　くなん',
    'こうどう　たいえき　りけん　むしば　ひっこし　そふぼ　たたく　ふこう　うわき　いくぶん　ぼうぎょ　へいがい',
    'こくご　たこやき　せんもん　せすじ　わかれる　らっか　てんぐ　よそう　むよう　かがみ　ちめいど　さずかる',
    'こんなん　るいじ　きつつき　いてん　みやげ　おうべい　ゆうき　あゆむ　しごと　すっかり　りれき　もうしあげる',
    'なまえ　こつばん　にんか　ほいく　かめれおん　がんばる　せつぞく　がいこう　かくとく　やける　しんせいじ　たいけん',
    'まがる　ふつう　こぜん　ながい　いたずら　あずき　おいかける　あらためる　べんきょう　すふれ　くかん　こうたい',
    'はせる　りゅうがく　こうちゃ　すべる　むいか　てまえ　ちわわ　せいよう　けはい　うりきれ　はんこ　えんかい',
    'しごと　しっかり　しゃおん　うりあげ　せたい　るいけい　ふすま　げきやく　かゆい　れいぞうこ　いちりゅう　おいつく',
    'にんげん　ここのか　とらえる　くるま　しゅくはく　むすう　けってい　ゆらい　てぬぐい　おしいれ　だんわ　すれちがう',
    'ずっしり　ねんきん　えまき　とっきゅう　ねんいり　きはく　くとうてん　よごれる　けおりもの　ととのえる　うすぐらい　ひっし',
    'くるま　せけん　せんめんじょ　たそがれ　ひかん　まじめ　せきにん　ひろい　ちょうし　おくじょう　こうはい　ためる',
    'すずしい　ねぶそく　こうもく　そうり　ほうそう　よそう　ていぼう　とさか　せきにん　しあげ　ようい　よそう',
    'こせき　しゃうん　つもり　ふっかつ　ごまあぶら　こうはい　けなげ　けんすう　ひそむ　せっこつ　うんてん　ねんれい',
    'そざい　けまり　やたい　そめる　ていこく　しいん　おんけい　はっかく　げんき　しかい　たすける　になう',
    'さむけ　かほう　みなみかさい　さんか　きおく　てうち　おたがい　いりょう　ざいえき　せんとう　くせん　せんきょ',
    'ゆしゅつ　たいふう　ねったいぎょ　てあみ　そっけつ　のこぎり　いのち　めだつ　むける　くすりゆび　いわば　いほう',
    'たりょう　さいせい　ろんぱ　かほう　こちょう　まよう　あずかる　はんすう　へきが　とそう　ないす　むすう',
    'くつろぐ　まかい　たいる　よさん　はいすい　にっか　ざいげん　けとばす　ねあげ　げねつ　いわば　ぜんぽう',
    'ふうせん　ぎしき　のいず　たいえき　ゆうめい　きあい　うぶげ　あいこくしん　へいさ　えほうまき　るすばん　じゆう',
    'せっきゃく　れいとう　ねんれい　まほう　げきちん　ひっこし　いちりゅう　にんてい　あしあと　ようちえん　たいねつ　のせる',
    'してつ　ほおん　このよ　へいげん　うけたまわる　いそうろう　かかえる　くれる　もらう　ふっこく　こくとう　はみがき',
    'みらい　うしろがみ　おかえり　たいまつばな　たいほ　たんそく　めいさい　かわく　こちょう　いそがしい　せんぱい　しへい',
    'しのぐ　くしゃみ　たろっと　るいけい　たんのう　そうご　ひやけ　ぜんりゃく　めいし　たぬき　とける　けあな',
    'いてざ　もくようび　とどける　しょうかい　だいどころ　さずかる　ひみつ　みとめる　とめる　てんぷら　ずひょう　るすばん',
    'りれき　ゆうびんきょく　でんあつ　ちたん　まなぶ　しゃくほう　まかせる　あつかう　てちょう　いのる　あつかう　こもん',
    'みこん　へいねつ　あじわう　ちしりょう　きなが　かあつ　てんぷら　にくしみ　ばあさん　おうえん　こやく　きあつ',
    'にっけい　しゃちょう　れいぞうこ　せんさい　せいげん　きむずかしい　じてん　しおけ　うけとる　みがく　さいしょ　いちおう',
    'しゃいん　くきょう　こさめ　いれい　しかく　こつばん　さつまいも　ほっさ　ことし　めんせき　おじぎ　みわく',
    'かいが　しんか　あまり　すきま　いわば　はんてい　おんどけい　けつじょ　みかた　せかいかん　つぶす　そんけい',
    'はくしゅ　ぐこう　いてん　ふじみ　ふくざつ　ないしょ　かいつう　きもち　いずみ　ろこつ　さほど　たにん',
    'しょくたく　はんらん　うごかす　ひかる　ぐんしょく　ねまき　ゆたか　すいか　ついか　せんしゅ　ねむい　きぞく',
    'はやい　にんき　とおく　るいせき　むさぼる　びじゅつかん　ぐたいてき　やそう　ごうまん　ちつじょ　じゃがいも　にちじょう',
    'ふすま　ごますり　ふのう　ごうけい　ずひょう　かがし　だんねつ　ようい　けんない　ふるい　ふりこ　ろんぱ',
    'とつぜん　にんにく　ひまん　だんわ　ばいばい　ねほりはほり　ちてき　こせき　ぱんつ　しゃそう　ほんやく　しめい',
    'おじさん　しはい　いっそう　あつまり　からい　うれる　におい　こうつう　せかいかん　はせる　めした　くたびれる',
    'きよう　たいけん　くめる　えつらん　しゃちょう　にしき　へいき　しゃざい　おやゆび　ゆけつ　にんぷ　そがい',
    'みとめる　としょかん　ときおり　たかい　ねこぜ　けぬき　たべる　ひろき　ざつがく　とばす　うちき　けおりもの',
    'しんせいじ　けつあつ　けねん　こくご　てんかい　ねんきん　たいそう　えつらん　しょうかい　どうぐ　ちあん　こもの',
    'はせる　してい　ほんしつ　はっくつ　おしゃれ　せんぱい　えんかい　まさつ　かいぞうど　あぶる　かんち　ひひょう',
    'こわれる　はたん　ねったいぎょ　てほん　くうぼ　けいろ　ごますり　てんめつ　くらべる　まろやか　まとめ　かようび',
    'ねんど　たはつ　きさま　へんさい　すべて　ぎじかがく　うつる　ふんしつ　ほんい　いりぐち　ちゆりょく　かいぜん',
    'れんしゅう　すぶり　どようび　へいこう　こんなん　たあい　きかんしゃ　せんろ　きちょう　まこと　るりがわら　うんこう',
    'ふしぎ　ようちえん　せんもん　きのした　てれび　うなる　ちせい　とかい　えんそく　ふっき　ほたて　しうち',
    'よねつ　ほんけ　はいしん　うかべる　ちまた　うまれる　つまらない　よしゅう　たれる　とこや　ぎじにってい　うつくしい',
    'せいよう　あたる　たいない　さつまいも　ねほりはほり　ますく　おかわり　たいやき　たいのう　めいそう　そっせん　してつ',
    'しなぎれ　とらえる　みかた　あこがれる　きむずかしい　とっきゅう　がんか　ひさい　ふめつ　くうかん　ぬかす　めした',
    'さんらん　にんよう　むかい　かめれおん　たいてい　じゅしん　ねこぜ　さいてき　いんよう　さよく　げこう　まつり',
    'こしつ　みじかい　にわとり　いんさつ　そうめん　てわたし　たりる　すのこ　まぜる　みがく　したぎ　つづく',
    'せんすい　うりきれ　おしゃれ　めいわく　さいかい　しょもつ　せっきゃく　のらねこ　にかい　あまやかす　けわしい　たいそう',
    'みなと　ほしゅ　てはい　くやくしょ　きない　かわら　そもそも　りょうり　ぶたにく　えがお　ふこう　らたい',
    'ちから　さとう　ふきん　いじょう　いだい　やせる　せんたく　ほけん　ちあん　すわる　なまみ　せんきょ',
    'すはだ　あわせる　はんてい　じてん　じぶん　あらし　ふっき　にんめい　とんかつ　ようじ　ほったん　てんかい',
    'ざいりょう　てわたし　たたかう　いいだす　しほん　こてん　あらためる　ふうとう　せんえい　あわせる　けんげん　せつめい',
    'こひつじ　すくう　ひひょう　けとばす　しゃせん　ふつか　ちんたい　なっとう　ぶんぽう　へいげん　さいしょ　たいせつ',
    'みねらる　そつえん　けいれき　こゆう　やすたろう　ふかい　たわむれる　いったん　だんれつ　ぱんつ　きくばり　しのぶ',
    'ゆびわ　てわけ　うえき　なにわ　ゆしゅつ　ておくれ　れきだい　びんぼう　つもる　だいすき　ひまん　にせもの',
];

mnemonics.forEach((mnemonic, index) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const path = "m/84'/0'/0'/0/0"; // BIP84, Bitcoin, account 0, change 0, address 0 (P2WPKH用のパス)
  const child = root.derivePath(path);
  const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });

  console.log(`address${index + 1}: ${address}`);
});
