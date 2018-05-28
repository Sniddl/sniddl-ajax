# sniddl-ajax
Develop real-time applications faster!
Give any element the ability to link to pages and make requests. No complex components, no onclick functions, & no event listeners. Just link and go!

#### How it works
When the init function is called. It will attach a  `SniddlComponent` instance to the queried HTML elements. The `SniddlComponent` makes a click event based on the data you provided.

## Installation
Install Sniddl-Ajax with npm or just use the JS file like any other JS file.
```
npm install sniddl-ajax
```
Then load it into your project.
```js
window.Sniddl = require('sniddl-ajax');
```
Be sure to use [webpack](https://webpack.github.io/) or [browserify](http://browserify.org/) if necessary.

## Use
You must define which elements will be linkable. This can be done my calling the init method. Data inside the headers & params objects are sent with every request.
```js
Sniddl.init('.linkable', {
  addCss: false
  headers: {},
  params: {}
});
```
If you don't want to provide any extra options that will work too.
```js
Sniddl.init('.linkable');
```

To finish making an element linkable ensure that it has the proper attributes so it can be selected by the init method. In this example all linkable elements with have the `linkable` class name. Then use one of the attributes listed below. (ex: `method="post"` or `data-method="post"`) **The url attribute is required**

```HTML
<h1 class="linkable" url="http://google.com">Go to Google's website</h1>
```

Attribute | Type | Description | Optional
---|:---:|---|:---:
**url** |  String | The url that will be used in the request. | **no**
**params** | JSON | The JSON string to use in the request. | yes
**method** | String | Define what HTTP method you're using. (get, post, put, etc.) | yes
**onsuccess** | Function | The name of the function that will run when the request is successful. Only applies to ajax requests | yes
**onerror**  |  Function | The name of the function that will run when the request has failed. Only applies to ajax requests | yes
**redirect** | Boolean | If true, the a form will be used instead of ajax. Only works if a method is defined. | yes
**blank** | Boolean | If true, the link will open in a new tab. Only works if a method does not exist. (ie. a simple link) | yes

#### Use cases

Open the image in a new tab when clicked.
```html
<img src="http://placehold.it/350x150" url="https://placehold.it" blank>
```

Logout users with a post method.
```html
<button url="/logout"
        method="post"
        params='{"csrf_token": "..." }'>
        Logout
</button>
```

Fetch more posts.
```HTML
<button id="load-more"
        url="/posts?page=2"
        method="get"
        onsuccess="loadMore">
        Load more
</button>
```

```JS
function loadMore(res) {
  $('#load-more').attr('url', '/post')
}
```
