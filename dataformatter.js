// Generated by CoffeeScript 1.9.2
window.DataFormatter = {
  functions: {},
  locale: {
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    months_short: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    days_short: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    thousands_separator: ' ',
    decimal_separator: ',',
    formats: {
      'General Number': '#.#',
      'Currency': '#,##0.00р.;[Red]-#,##0.00р.',
      'Fixed': '0.00',
      'Standard': '#,##0.00',
      'Percent': '0.00%',
      'Scientific': '0.00E+00',
      'Yes/No': '"Да";"Да";"Нет"',
      'True/False': '"Истина";"Истина";"Ложь"',
      'On/Off': '"Вкл";"Вкл";"Выкл"',
      'Short Date': 'mm.dd.yyyy',
      'Long Date': 'dd mmmm yyyy',
      'General Date': 'mm.dd.yyyy h:mm',
      'Medium Date': 'dd.mmm.yy',
      'Long Time': 'hh:mm:ss AM/PM',
      'Short Time': 'h:mm',
      'Medium Time': 'hh:mm AM/PM'
    }
  },
  format: function(n, type, pattern) {
    var abs, code, code_tmp, condition, d, digit_fun, elapsed, factor, frac_part, i, int_part, ptrn, repl, repl_$, sectors, t_l;
    n = n.toString();
    pattern = pattern.toString();
    if (DataFormatter.functions[pattern]) {
      return DataFormatter.functions[pattern](n, type);
    }
    code = '';
    repl = '';
    repl_$ = '';
    sectors = pattern;
    if (DataFormatter.locale.formats[sectors]) {
      sectors = DataFormatter.locale.formats[sectors];
    }
    sectors = sectors.replace(/"([^"]+)"|\\(.?)|(_.?)|(\*.?)|(")/g, function(a, m1, m2, m3) {
      if (m1) {
        repl += ",\"" + (m1.replace(/("|'|\\)/g, "\\$1")) + "\"";
        return "[" + (repl_$ += '$') + "]";
      }
      if (m2) {
        repl += ",\"" + (m2.replace(/("|'|\\)/g, "\\$1")) + "\"";
        return "[" + (repl_$ += '$') + "]";
      }
      if (m3) {
        repl += '," "';
        return "[" + (repl_$ += '$') + "]";
      }
      return '';
    });
    code = "var repl = [" + repl + "];";
    sectors = sectors.split(/;/);
    i = -1;
    t_l = Math.min(4, sectors.length);
    while (++i < t_l) {
      condition = '';
      abs = false;
      condition = sectors[i].match(/\[((?:>|>=|<|<=|=|<>)[0-9\.]+?)]/);
      if (condition) {
        condition = "type=='Number' && n " + (condition[1].replace(/<>/, '!=').replace('/=/', '=='));
      } else if (i === 0 && sectors.length > 2) {
        condition = 'type=="Number" && n>0';
      } else if (i === 0 && sectors.length > 1) {
        condition = 'type=="Number" && n>=0';
      } else if (i === 1 && sectors.length > 2) {
        condition = 'type=="Number" && n<0';
        abs = true;
      } else if (i === 2 && sectors.length > 3) {
        condition = 'type=="Number"';
      }
      code_tmp = "var res={value:'" + sectors[i] + "'};\nif (type == \"Number\" || type ==\"DateTime\") res.align = 'right';";
      if (ptrn = sectors[i].match(/\[(Red|Green|White|Blue|Magenta|Yellow|Cyan|Black)]/i)) {
        code_tmp += "res.color='" + ptrn[1] + "';";
      }
      sectors[i] = sectors[i].replace(/(\[((?!((\$*?)|(h*?)|(m*?)|(s*?))]).*?)])/, '');
      if (sectors[i].match(/General/i)) {
        code_tmp += "res.value=n;\nif (type == 'Number'){\n  if (!isNaN(n) && n!=''){\n    if (n<1e21 && n>-1e21){\n      n=parseFloat(n);\n      res.value=n;\n      if (n != parseInt(n / 1)) {\n        res.value = (Math.round(n*100)/100).toString().replace(/\\./,'" + DataFormatter.locale.decimal_separator + "');\n      }\n    }\n    else{\n      res.value=n.toString().toUpperCase();\n    }\n  }\n}\nelse if(type == 'DateTime' && !isNaN((new Date(n)).getTime())){\n  res.value = Math.abs((new Date(n)).getTime()-(new Date('1899-12-31T00:00:00.000')).getTime())/1000/60/60/24;\n}";
      } else {
        if (sectors[i].match(/@/)) {
          code_tmp += "res.value='" + sectors[i] + "'.replace(/@/,n);";
        } else if (sectors[i].match(/#|\?|0/)) {
          digit_fun = "n=parseFloat(n);";
          if (abs) {
            digit_fun += "n=Math.abs(n);";
          }
          if (ptrn = sectors[i].match(/(.*?)(?:(\.)(.*?))?e(?:\+|\-)(.*)/i)) {
            if (!ptrn[1]) {
              ptrn[1] = '#';
              int_part = 10;
            } else {
              int_part = Math.pow(10, ptrn[1].match(/0|\?|#/g).length);
            }
            if (!ptrn[3]) {
              ptrn[3] = '';
              frac_part = 1;
            } else {
              frac_part = Math.pow(10, ptrn[3].match(/0|\?|#/g).length);
            }
            if (!ptrn[4]) {
              ptrn[4] = '';
            }
            digit_fun += "var m=0,sign=n<0?-1:1;\nn=Math.abs(n);\nif(n!=0){\n while(n < " + int_part + " || Math.round(n*" + frac_part + ")/" + frac_part + " < " + int_part + "){\n   n*=10;\n   m++;\n }\n while(n >= " + int_part + " || Math.round(n*" + frac_part + ")/" + frac_part + " >= " + int_part + "){\n   n/=10;\n   m--;\n }\n}\nn=(Math.round(n*sign*" + frac_part + ")/" + frac_part + ").toString().split('.');\nres.value=DataFormatter.fillNumberPattern(parseInt(n[0]),'" + ptrn[1] + "')";
            if (ptrn[2]) {
              digit_fun += "+'" + DataFormatter.locale.decimal_separator + "'";
              if (ptrn[3]) {
                digit_fun += "+DataFormatter.fillNumberPattern(parseInt(n[1] ? n[1] : 0),'" + ptrn[3] + "','right')";
              }
            }
            digit_fun += "+'E'+(m>0?'-':'+')+DataFormatter.fillNumberPattern(Math.abs(m),'" + ptrn[4] + "');";
          } else {
            factor = 1;
            sectors[i] = sectors[i].replace(/(0|#|\?)(,+)([^0?#]*)$/, function(a, m1, m2, m3) {
              factor *= Math.pow(1000, m2.length);
              return m1 + m3;
            });
            if (ptrn = sectors[i].match(/%/g)) {
              factor /= Math.pow(100, ptrn.length);
            }
            if (ptrn = sectors[i].match(/(.*?)\/(.*)/)) {
              if (!ptrn[1]) {
                ptrn[1] = '#';
              }
              if (!ptrn[2]) {
                ptrn[2] = '#';
              }
              d = ptrn[1].length - 1;
              while (ptrn[1][d] === '0' && ptrn[1][d] !== '?' && ptrn[1][d] !== '#' && ptrn[1][d] !== ' ' && d > 0) {
                d--;
              }
              ptrn[3] = ptrn[1].substr(0, d);
              ptrn[4] = ptrn[1].substr(d);
              if (!ptrn[3]) {
                digit_fun += "var m=n.toString().split(\".\");\nm=m[1]?Math.pow(10,m[1].length):1;\nn=Math.floor(n*m);\nvar factor=DataFormatter.gcd(n,m);\nres.value=DataFormatter.fillNumberPattern(n/factor,'" + ptrn[4] + "')+'/'+DataFormatter.fillNumberPattern(m/factor,'" + ptrn[2] + "');";
              } else {
                digit_fun += "var f=0, factor=1, c=1, m=n.toString().split('.');\nif(m[1]){c=Math.pow(10,m[1].length); f=parseInt(m[1]); factor=DataFormatter.gcd(f,c);}\nres.value=DataFormatter.fillNumberPattern(Math.floor(n),'" + ptrn[3] + "') + DataFormatter.fillNumberPattern(f/factor,'" + ptrn[4] + "') + '/' + DataFormatter.fillNumberPattern(c/factor,'" + ptrn[2] + "');";
              }
            } else if (ptrn = sectors[i].match(/(.*?)\.(.*)/)) {
              if (!ptrn[1]) {
                ptrn[1] = '0';
              }
              if (!ptrn[2]) {
                ptrn[2] = '';
                frac_part = 1;
              } else {
                frac_part = Math.pow(10, ptrn[2].match(/0|\?|#/g).length);
              }
              ptrn[1] = ptrn[1].replace(/(0|#|\?)(,+)([^0?#]*)$/, function(a, m1, m2, m3) {
                factor *= Math.pow(1000, m2.length);
                return m1 + m3;
              });
              digit_fun += "n=(Math.round(n*" + frac_part + ")/" + frac_part + ").toString().split('.');\nres.value=DataFormatter.fillNumberPattern(parseInt(n[0]),'" + ptrn[1] + "')+'" + DataFormatter.locale.decimal_separator + "'+DataFormatter.fillNumberPattern(parseInt(n[1]||0),'" + ptrn[2] + "','right');";
            } else {
              digit_fun += "res.value=DataFormatter.fillNumberPattern(Math.round(n),'" + sectors[i] + "');";
            }
            if (factor !== 1) {
              digit_fun = "n/=" + factor + ";\n" + digit_fun;
            }
          }
          digit_fun = "if(n<1e21 && n>-1e21){\n  " + digit_fun + "\n}\nelse{\n  res.value=n.toString().toUpperCase();\n}";
          if (!condition) {
            condition = 'type=="Number"';
          }
          code_tmp += digit_fun;
        } else if (sectors[i].match(/h|m|s|y/i)) {
          elapsed = false;
          sectors[i] = sectors[i].replace(/\[(h+?|m+?|s+?|y+?)]/ig, function(a, m1) {
            elapsed = true;
            return m1;
          });
          code_tmp += "if(type=='DateTime'){\n  n=new Date(n);\n  if (!isNaN(n.getTime())){";
          if (elapsed) {
            code_tmp += "var m, found_hours, found_minutes;\nn=Math.abs(n.getTime()-(new Date('1899-12-31T00:00:00.000')).getTime());";
            sectors[i] = sectors[i].replace(/a|p|am|pm|mmm|mmmm|mmmmm|d|y/gi, '');
            if (sectors[i].match(/h/i)) {
              code_tmp += "found_hours=true;";
            }
            if (sectors[i].match(/m/i)) {
              code_tmp += "found_minutes=true;";
            }
            code_tmp += "res.value='" + sectors[i] + "'.replace(/(hh)|(h)|(mm)|(m)|(ss)|(s)/gi,function(a,hh,h,mm,m,ss,s){\n  if (hh) { return (m=parseInt(n/1000/60/60))<10 ? '0'+m : m; }\n  if (h) return parseInt(n/1000/60/60);\n  if (mm) { m=found_hours ? parseInt(n/1000/60%60) : parseInt(n/1000/60) ;  return m<10 ? '0'+m : m; }\n  if (m) { m=found_hours ? parseInt(n/1000/60%60) : parseInt(n/1000/60) ;  return m; }\n  if (ss) { m=found_minutes ? parseInt(n/1000%60) : parseInt(n/1000) ;  return m<10 ? '0'+m : m; }\n  if (s) { m=found_minutes ? parseInt(n/1000%60) : parseInt(n/1000) ;  return m; }\n  return '';\n});";
          } else {
            code_tmp += "var found_ampm\nres.value='" + sectors[i] + "'.replace(/((?:am\\/pm)|(?:a\\/p))|(?:(h[^ydsap]*?)mm)|(?:mm([^ydh]*?s))|(?:(h[^ydsap]*?)m)|(?:m([^ydh]*?s))/gi,function(a,ampm,fmin,fmin2,mmin,mmin2){\n  if (ampm) { found_ampm=true; return '[]'; }\n  if (fmin) { m=n.getMinutes(); return fmin + (m<10 ? '0' + m : m); }\n  if (fmin2) { m=n.getMinutes(); return (m<10 ? '0' + m : m) + fmin2; }\n  if (mmin) return mmin + n.getMinutes();\n  if (mmin2) return n.getMinutes() + mmin2;\n  return '';\n  });\n  res.value=res.value.replace(/(ss)|(s)|(hh)|(h)|(dddd)|(ddd)|(dd)|(d)|(mmmmm)|(mmmm)|(mmm)|(mm)|(m)|(yyyy)|(yy)|(\\[])/gi,function(a,ss,s,hh,h,dddd,ddd,dd,d,mmmmm,mmmm,mmm,mm,m,yyyy,yy,ampm){\n  if (ss) { m=n.getSeconds(); return m<10 ? '0' + m : m; }\n  if (s) return n.getSeconds();\n  if (hh) { m=n.getHours(); if (found_ampm) m=m%12; return m<10 ? '0' + m : m; }\n  if (h) { if (found_ampm) m=m%12; return n.getHours(); }\n  if (hh) { m=n.getHours(); return m<10 ? '0' + m : m; }\n  if (dddd) return DataFormatter.locale.days[n.getDay()];\n  if (ddd) return DataFormatter.locale.days_short[n.getDay()];\n  if (dd) { m=n.getDate(); return m<10 ? '0' + m : m; }\n  if (d) return n.getDate();\n  if (mmmmm) return DataFormatter.locale.months_short[n.getMonth()][0];\n  if (mmmm) return DataFormatter.locale.months[n.getMonth()];\n  if (mmm) return DataFormatter.locale.months_short[n.getMonth()];\n  if (mm) { m=n.getMonth()+1; return m<10 ? '0' + m : m; }\n  if (m) return n.getMonth()+1;\n  if (yyyy) return n.getFullYear();\n  if (yy) return n.getFullYear().toString().substr(2);\n  if (ampm) return n.getHours()<12 ? 'AM' : 'PM';\n  return '';\n});";
          }
          code_tmp += "}}";
        }
        code_tmp += "res.value=DataFormatter.makeReplaces(res.value,repl);";
      }
      code_tmp += "return res;";
      code += condition ? "if(" + condition + "){\n  " + code_tmp + "\n}" : code_tmp;
    }
    code += "return {value:n};";
    return (DataFormatter.functions[pattern] = Function('n,type', code))(n, type);
  },
  fillNumberPattern: function(n, pattern, direction) {
    var i, j, most_left_digit, ref, ref1, ref2, ref3, ref4, ref5, s, separate_thousands, t_l;
    n = n.toString();
    s = '';
    if (direction === 'right') {
      j = 0;
      i = -1;
      t_l = pattern.length;
      while (++i < t_l) {
        switch (pattern[i]) {
          case '0':
            s += (ref = n[j]) != null ? ref : '0';
            j++;
            break;
          case '#':
            s += (ref1 = n[j]) != null ? ref1 : '';
            j++;
            break;
          case '?':
            s += (ref2 = n[j]) != null ? ref2 : ' ';
            j++;
            break;
          case '[':
            while (i < pattern.length && pattern[i] !== ']') {
              s += pattern[i];
              i++;
            }
            i--;
            break;
          default:
            s += pattern[i];
        }
      }
    } else {
      separate_thousands = false;
      pattern = pattern.replace(/(0|#|\?)(,+?)(0|#|\?)/g, function(a, m1, m2, m3) {
        separate_thousands = true;
        return m1 + m3;
      });
      if (separate_thousands) {
        j = n.length - 3;
        while ((n[0] === '-' ? j > 1 : j > 0)) {
          n = n.substr(0, j) + DataFormatter.locale.thousands_separator + n.substr(j);
          j -= 3;
        }
      }
      j = n.length - 1;
      i = pattern.length;
      while (i--) {
        switch (pattern[i]) {
          case '0':
            s = ((ref3 = n[j]) != null ? ref3 : '0') + s;
            most_left_digit = i;
            j--;
            break;
          case '#':
            s = ((ref4 = n[j]) != null ? ref4 : '') + s;
            most_left_digit = i;
            j--;
            break;
          case '?':
            s = ((ref5 = n[j]) != null ? ref5 : ' ') + s;
            most_left_digit = i;
            j--;
            break;
          case ']':
            while (i > 0 && pattern[i] !== '[') {
              s = pattern[i] + s;
              i--;
            }
            i++;
            break;
          default:
            s = pattern[i] + s;
        }
      }
      if (j >= 0 && most_left_digit !== null) {
        s = s.substr(0, most_left_digit) + n.substr(0, j + 1) + s.substr(most_left_digit);
      }
    }
    return s;
  },
  makeReplaces: function(s, repl) {
    return s = s.replace(/\[(?:(\$*?)|(.*?))\]/g, function(a, m1) {
      if (m1 && repl[m1.length]) {
        return repl[m1.length];
      } else {
        return '';
      }
    });
  },
  gcd: function(a, b) {
    var r;
    while (b) {
      r = a % b;
      a = b;
      b = r;
    }
    return a;
  }
};

//# sourceMappingURL=dataformatter.map
