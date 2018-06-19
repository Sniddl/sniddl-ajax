function Sniddl(query) {
  var elements = document.querySelectorAll(query);
  var list = [];
  for (var i = 0; i < elements.length; i++) {
    if (elements[i]["__sniddl__"]) list.push(elements[i])
  }
  return list;
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    console.log(mutation);
  });
});

Sniddl.set = function(query, key, value, init=false) {
  var elements = document.querySelectorAll(query);
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    el.$sniddl.$data = el.$sniddl.$data || {}
    var old = el.$sniddl.$data;
    el.$sniddl.$data[key] = value
    if (el.$sniddl.onmount && init) window[el.$sniddl.onmount](el.$sniddl, el.$sniddl.$data, old)
    else if (el.$sniddl.onbind && !init) window[el.$sniddl.onbind](el.$sniddl, el.$sniddl.$data, old)
  }
}

Sniddl.init = function(query, options={}) {
  if (options.addCss) Sniddl.addCss(query);
  // document.addEventListener('DOMContentLoaded', function () {
  var elements = document.querySelectorAll(query);
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    if (el.$sniddl) continue
    Object.defineProperty(el, '$sniddl', {
      get () {
        return this.__sniddl__.make()
      },
      set (val) {
        return this.__sniddl__ = val
      }
    })
    el["$sniddl"] = new SniddlComponent(el, options);
  }
  var binds = document.querySelectorAll('[bind]');
  for (var i = 0; i < binds.length; i++) {
    var el = binds[i];
    Sniddl.set(query, 'value', el.value, true)
    el.addEventListener('input', function(e) {
      var query = e.target.getAttribute('bind');
      Sniddl.set(query, 'value', e.target.value)
    })

    // el["__binds__"] = new SniddlComponent(el, options);
  }
  // })
}

Sniddl.addCss = function(query) {
  var css = query + ':hover{cursor: pointer;}';
  var style = document.createElement('style');
  if (style.styleSheet) style.styleSheet.cssText = css;
  else style.appendChild(document.createTextNode(css));
  document.getElementsByTagName('head')[0].appendChild(style);
}

// Sniddl.watch = function (el) {
//   console.log('watchingg...', el);
//   var ob = new MutationObserver(function (mutations) {
//     for(var mutation in mutations) {
//       console.log(mutation.type, mutation);
//     }
//   })
//   ob.observe(el, { attributes: true, childList: true, characterData: true, subtree: true })
// }

SniddlComponent.prototype.eval = function (str) {
  if (!this.el.hasAttribute(':' + str)) {
    if (!this.$watch) return false
    if (!this.$watch[str]) return false
    if (this.$data[str]) {
      return this.$data[str]
    } else {
      return eval(this.$watch[str]);
    }
  }
  // console.log('evaling', eval(this.el.getAttribute(str)), this);

  this.$watch = this.$watch || {}
  this.$watch[str] = this.el.getAttribute(':' + str)
  this.el.removeAttribute(':' + str);
  if (this.$data[str]) {
    return this.$data[str]
  } else {
    return eval(this.$watch[str]);
  }
}

SniddlComponent.prototype.change = function(key, val) {
  if (this.$watch[key]) this.$data[key] = val;
  else this[key] = val
}

SniddlComponent.prototype.getAttr = function (str) {
  if (!this.el.hasAttribute(str)) return this[str]
  return this.el.getAttribute(str);
}

SniddlComponent.prototype.hasAttr = function (str) {
  if (!this.el.hasAttribute(str)) return this[str]
  return this.el.hasAttribute(str);
}

function SniddlComponent(el, options) {
  this.el = el;
  this.$data = {}
  this.data = options.params;
  this.headers = options.headers;
  this.make()
  this.removeAttributes('url data-url params data-params method data-method onerror data-onerror onsuccess data-onsuccess redirect data-redirect blank data-blank');
  if (this.params) this.params = JSON.parse(this.params);
  this.params = Object.assign(this.params || {}, this.data);
  this.el.onclick = this.click;
}

SniddlComponent.prototype.make = function() {
  var a = this.getAttr.bind(this);
  var h = this.hasAttr.bind(this);
  var e = this.eval.bind(this);
  this.url = e('url') || a('url') || a('data-url');
  this.params =  a('params') || a('data-params');
  this.method =  a('method') || a('data-method');
  this.onerror =  a('onerror') || a('data-onerror') || console.error;
  this.onsuccess = a('onsuccess') || a('data-onsuccess');
  this.onbind = a('onbind') || a('data-onbind');
  this.redirect = h('redirect') || h('data-redirect');
  this.blank = h('blank') || h('data-blank');
  return this

}

SniddlComponent.prototype.removeAttributes = function(str) {
  var attrs = str.split(' ')
  for (var i = 0; i < attrs.length; i++) {
    this.el.removeAttribute(attrs[i])
  }
}

SniddlComponent.prototype.click = function(e) {
  e.preventDefault();
  e.stopPropagation();

  if(e.target.href) return e.target.target ? window.open(e.target.href, e.target.target) : window.location.href = e.target.href;
  var s = this.$sniddl;
  if (!s.method) return s.blank ? window.open(s.url, '_blank') : window.location.href = s.url;
  else if (s.redirect) s.formRequest()
  else return s.xmlRequest()
}

SniddlComponent.prototype.formRequest = function(data) {
  var form = document.createElement('form');
  form.setAttribute('method', this.method);
  form.setAttribute('action', this.url);
  form.style.display = 'none';
  document.body.appendChild(form);
  for (var key in this.params) {
    var input = document.createElement('input');
    input.setAttribute('name', key);
    input.setAttribute('value', this.params[key]);
    input.setAttribute('type', 'hidden');
    form.appendChild(input)
  }
  form.submit()
}


SniddlComponent.prototype.xmlRequest = function() {
  var data = this.make()
  console.log(data.url);
  var x = new XMLHttpRequest();
  x.open(data.method, data.url);
  if (data.headers) {
    for (var key in data.headers) {
      x.setRequestHeader(key, data.headers[key]);
    }
  }
  x.onload = function () {
    var res = JSON.parse(x.responseText);
    if (x.status >= 200 && x.status < 300 && data.onsuccess) {
      window[data.onsuccess](data, res)
    } else if (x.status < 200 || x.status >= 300) {
      if (data.onerror === console.error) console.error('Sniddl Ajax Response Error:', res);
      else window[data.onerror](data, res)
    }
  }.bind(data)
  x.send(JSON.stringify(data.params))
}

SniddlComponent.prototype.constructor = SniddlComponent;

try {
  module.exports = Sniddl
} catch (e) {

}
