(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{1269:function(e,t,n){"use strict";var i=n(35),o=n(122);function r(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var s=n(4),h=n.n(s),d=(n(15),!!document.documentElement.currentStyle),l={"min-height":"0","max-height":"none",height:"0",visibility:"hidden",overflow:"hidden",position:"absolute","z-index":"-1000",top:"0",right:"0"},u=["letter-spacing","line-height","font-family","font-weight","font-size","font-style","tab-size","text-rendering","text-transform","width","text-indent","padding-top","padding-right","padding-bottom","padding-left","border-top-width","border-right-width","border-bottom-width","border-left-width","box-sizing"],p={},g=document.createElement("textarea"),c=function(e){Object.keys(l).forEach(function(t){e.style.setProperty(t,l[t],"important")})};function f(e,t,n,i,o){void 0===n&&(n=!1),void 0===i&&(i=null),void 0===o&&(o=null),null===g.parentNode&&document.body.appendChild(g);var r=m(e,t,n);if(null===r)return null;var a=r.paddingSize,s=r.borderSize,h=r.boxSizing,d=r.sizingStyle;Object.keys(d).forEach(function(e){g.style[e]=d[e]}),c(g),g.value=e.value||e.placeholder||"x";var l=-1/0,u=1/0,p=g.scrollHeight;"border-box"===h?p+=s:"content-box"===h&&(p-=a),g.value="x";var f=g.scrollHeight-a,b=Math.floor(p/f);return null!==i&&(l=f*i,"border-box"===h&&(l=l+a+s),p=Math.max(l,p)),null!==o&&(u=f*o,"border-box"===h&&(u=u+a+s),p=Math.min(u,p)),{height:p,minHeight:l,maxHeight:u,rowCount:Math.floor(p/f),valueRowCount:b}}function m(e,t,n){if(void 0===n&&(n=!1),n&&p[t])return p[t];var i=window.getComputedStyle(e);if(null===i)return null;var o=u.reduce(function(e,t){return e[t]=i.getPropertyValue(t),e},{}),r=o["box-sizing"];if(""===r)return null;d&&"border-box"===r&&(o.width=parseFloat(o.width)+parseFloat(i["border-right-width"])+parseFloat(i["border-left-width"])+parseFloat(i["padding-right"])+parseFloat(i["padding-left"])+"px");var a={sizingStyle:o,paddingSize:parseFloat(o["padding-bottom"])+parseFloat(o["padding-top"]),borderSize:parseFloat(o["border-bottom-width"])+parseFloat(o["border-top-width"]),boxSizing:r};return n&&(p[t]=a),a}c(g);var b=function(e){delete p[e]},w=function(){},v=0,x=function(e){function t(t){var n;return(n=e.call(this,t)||this)._onRef=function(e){n._ref=e,n.props.inputRef(e)},n._onChange=function(e){n._controlled||n._resizeComponent(),n.props.onChange(e,a(a(n)))},n._resizeComponent=function(e){void 0===e&&(e=w);var t=f(n._ref,n._uid,n.props.useCacheForDOMMeasurements,n.props.minRows,n.props.maxRows);if(null!==t){var i=t.height,o=t.minHeight,r=t.maxHeight,a=t.rowCount,s=t.valueRowCount;n.rowCount=a,n.valueRowCount=s,n.state.height===i&&n.state.minHeight===o&&n.state.maxHeight===r?e():n.setState({height:i,minHeight:o,maxHeight:r},e)}else e()},n.state={height:t.style&&t.style.height||0,minHeight:-1/0,maxHeight:1/0},n._uid=v++,n._controlled=void 0!==t.value,n._resizeLock=!1,n}r(t,e);var n=t.prototype;return n.render=function(){var e=this.props,t=(e.inputRef,e.maxRows,e.minRows,e.onHeightChange,e.useCacheForDOMMeasurements,Object(o.a)(e,["inputRef","maxRows","minRows","onHeightChange","useCacheForDOMMeasurements"]));return t.style=Object(i.a)({},t.style,{height:this.state.height}),Math.max(t.style.maxHeight||1/0,this.state.maxHeight)<this.state.height&&(t.style.overflow="hidden"),h.a.createElement("textarea",Object(i.a)({},t,{onChange:this._onChange,ref:this._onRef}))},n.componentDidMount=function(){var e=this;this._resizeComponent(),this._resizeListener=function(){e._resizeLock||(e._resizeLock=!0,e._resizeComponent(function(){e._resizeLock=!1}))},window.addEventListener("resize",this._resizeListener)},n.componentDidUpdate=function(e,t){e!==this.props&&this._resizeComponent(),this.state.height!==t.height&&this.props.onHeightChange(this.state.height,this)},n.componentWillUnmount=function(){window.removeEventListener("resize",this._resizeListener),b(this._uid)},t}(h.a.Component);x.defaultProps={inputRef:w,onChange:w,onHeightChange:w,useCacheForDOMMeasurements:!1};t.a=x}}]);