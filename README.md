# sniddl-ajax
Develop AJAX applications faster!
You no longer need to hunt down and write multiple AJAX click events. 
Just add a few attributes to the elements of your choosing then POW! 
Instant AJAX functionality & easy to read code! 
#### How it works 
When the page loads, it searches for specific attributes then attaches the data directly to the element object. 
Then it removes the previously declared attributes from the DOM. 
This makes it more challenging for Little Jimmy to snoop around your front-end code. 

## Installation
Install Sniddl-Ajax with npm or just use the JS file like any other JS file.
```
npm install sniddl-ajax
```
Then load it into your project.
```
require('sniddl-ajax');
```
Be sure to use [webpack](https://webpack.github.io/) or [browserify](http://browserify.org/) if necessary.

## Use
Using Sniddl-Ajax can be used right out of the box. Just add the data attributes that you want.
Or use the shorthand method by sticking an underscore in front of it.
`<h1 data-action="http://google.com"></h1>` Is the same as. `<h1 _action="http://google.com"></h1>`

Attribute | Type | Description | Optional
---|:---:|---|:---:
**ajax** |  Boolean | Determines if ajax should be used. | yes
**action** | String | The URL for the request. | **no**
**method** | String | An optional value for the method you're using. | yes
**success** | Javascript | Code that will run on a successful ajax request. | yes
**error**  |  Javascript | Code that will run on a failed ajax request. | yes
**json** | Object | Any data you might want to pass throught the request. | yes



So say you had an image that you wanted to link to the image source or another page.
You no longer need to wrap it in an anchor tag. Keep it simple by adding the action attribute. 
```
<img src="http://placehold.it/350x150" data-action="https://placehold.it">
```

Now maybe you want to create a secure logout link for your users. Normally you would have to use something like this.
```
<form action="index.html" method="post">
    <input type="hidden" name="_token" value="abcdefg123">
    <button type="submit">Logout</button>
</form>
```
Well guess what? You can save time now. Just do this.
```
<button _action="index.html" 
        _method="post" 
        _json='{"token": "abcdefg123" }'> 
Logout </button>
```
Honestly, you probably don't have a secure token that you can just type in. You most likely have it set as a cookie or stored somewhere else. You also probably don't want to type it in everytime you create a request. 
That's why I also allowed you to create permanent values. This can be a http header or a field. All you have to do is delecare the `__SNIDDL-AJAX__` object. This should be one of the first things javascript runs. 
```
__SNIDDL_AJAX__ = {
    data: {
      "_token": window.global.mysecuretoken
    },
    headers: {
      "api_key": mysecuretoken,
      "favorite_color": "blue"
    }
};
```
Finally you can use ajax so you can get data with out having to change the page.
```
<div class="title m-b-md"
     data-ajax="true"
     data-action="/vote/yes"
     data-method="post"
     data-success="this.innerHTML = 'thanks' "
     data-error="functionToRunOnError()"
     data-json='{"voted": true}'
 >
    Vote Yes
</div>
```

If you have any questions or you want to suggest a change, feel free to create a issue. I will be happy to look at it!
