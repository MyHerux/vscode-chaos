import {
  log
} from "util";

// CJK is short for Chinese, Japanese and Korean.
//
// The constant cjk contains following Unicode blocks:
// 	\u2e80-\u2eff CJK Radicals Supplement
// 	\u2f00-\u2fdf Kangxi Radicals
// 	\u3040-\u309f Hiragana
// 	\u30a0-\u30ff Katakana
// 	\u3100-\u312f Bopomofo
// 	\u3200-\u32ff Enclosed CJK Letters and Months
// 	\u3400-\u4dbf CJK Unified Ideographs Extension A
// 	\u4e00-\u9fff CJK Unified Ideographs
// 	\uf900-\ufaff CJK Compatibility Ideographs
//
// For more information about Unicode blocks, see
// 	http://unicode-table.com/en/
//  https://github.com/vinta/pangu

// ANS is short for Alphabets, Numbers and Symbols (`~!@#$%^&*()-_=+[]{}\|;:'",<.>/?).
//
// CAUTION: those ANS in following constants do not contain all symbols above.

const cjkQuote = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(["])/g;
const quoteCJK = /(["])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
const fixQuote = /(["']+)(\s*)(.+?)(\s*)(["']+)/g;
const fixSingleQuote = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])( )(')([A-Za-z])/g;

const hashANSCJKhash = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#)([A-Za-z0-9\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+)(#)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
const cjkHash = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#([^ ]))/g;
const hashCJK = /(([^ ])#)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;

const cjkOperatorANS = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\+\-\*\/=&\\|<>])([A-Za-z0-9])/g;
const ansOperatorCJK = /([A-Za-z0-9])([\+\-\*\/=&\\|<>])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;

const cjkBracketCJK = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c]+(.*?)[\)\]\}>\u201d]+)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
const cjkBracket = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c>])/g;
const bracketCJK = /([\)\]\}>\u201d<])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
const fixBracket = /([\(\[\{<\u201c]+)(\s*)(.+?)(\s*)([\)\]\}>\u201d]+)/;

const fixSymbol = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([~!;:,\.\?\u2026])([A-Za-z0-9])/g;

const cjkANS = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([A-Za-z0-9`\$%\^&\*\-=\+\\\|/@\u00a1-\u00ff\u2022\u2027\u2150-\u218f])/g;
const ansCJK = /([A-Za-z0-9`~\$%\^&\*\-=\+\\\|/!;:,\.\?\u00a1-\u00ff\u2022\u2026\u2027\u2150-\u218f])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;

//add ansSymbol to match end of the sentence.
const ansSymbol = /([A-Za-z0-9`])([~!;,，。\)\?\u2026])/g;
const Symbolans = /([~!;,，。\(\?\u2026])([A-Za-z0-9])/g;

const enCJK = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([A-Za-z0-9\@])/g;
const CJKen = /([A-Za-z0-9)])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;


class Chaos {


  spacing(text) {
    let newText = text;

    newText = newText.replace(cjkQuote, '$1 $2');
    newText = newText.replace(quoteCJK, '$1 $2');
    newText = newText.replace(fixQuote, '$1$3$5');
    newText = newText.replace(fixSingleQuote, '$1$3$4');

    newText = newText.replace(hashANSCJKhash, '$1 $2$3$4 $5');
    newText = newText.replace(cjkHash, '$1 $2');
    newText = newText.replace(hashCJK, '$1 $3');

    newText = newText.replace(cjkOperatorANS, '$1 $2 $3');
    newText = newText.replace(ansOperatorCJK, '$1 $2 $3');

    const oldText = newText;
    const tmpText = newText.replace(cjkBracketCJK, '$1 $2 $4');
    newText = tmpText;
    if (oldText === tmpText) {
      newText = newText.replace(cjkBracket, '$1 $2');
      newText = newText.replace(bracketCJK, '$1 $2');
    }
    newText = newText.replace(fixBracket, '$1$3$5');

    newText = newText.replace(fixSymbol, '$1$2 $3');

    newText = newText.replace(cjkANS, '$1 $2');
    newText = newText.replace(ansCJK, '$1 $2');

    return newText;
  }

  english(text) {
    let newText = text;

    newText = newText.replace(/\s+/g,"");
    newText = newText.replace(enCJK, '$1 `$2');
    newText = newText.replace(CJKen, '$1` $2');
    newText = newText.replace(ansSymbol, '$1` $2');
    newText = newText.replace(Symbolans, '$1 `$2');

    return newText;
  }

  keyword(text, keywords) {
    let newText = text;

    newText = newText.replace(enCJK, '$1 `$2');
    newText = newText.replace(CJKen, '$1` $2');
    newText = newText.replace(ansSymbol, '$1` $2');
    newText = newText.replace(Symbolans, '$1 `$2');

    keywords.forEach((val, idx, array) => {
      console.log(val)
      let key = RegExp("(" + val + ")");
      let keyGloble = RegExp(key, "g");
      newText = newText.replace(keyGloble, ' `$1` ');
    })

    return newText;
  }
}


export {
  Chaos
};