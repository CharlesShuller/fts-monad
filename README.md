Monad
===============================================================================

Mathmatically, Monads are sed to map functions into other functions.  For
general use in programming though, it's best to think of them as a collection
of functions.

For a more through information on Monads, the reader is encouraged to google
search "Haskell Monad Introduction".

To cheat, you can think of a Monad as a Promise for synchonous code.  You
wrap up some code in the monad, and then call ".then" on it to change things.
While the two constructs are indeed closely related, this analogy breaks down
in the specifics.

We provide this package primarily to support development purely functional data
structures, and other purely functional libraries.


Short Version
-------------------------------------------------------------------------------
*  A monad is kind of box for functions and data.
*  A monad is not an object, but an object can be a monad.
*  There is no "Monad" class, our examples will use a fictitious "MyMonad" and
   a ficticious "DifferentMonad".

```
const myMonad = new MyMonad(12);
//myMonad == {value: 12, tag: "MyMonad", ....}
```


You can change the stuff in the box by calling "fmap" which gives you the
same kind box with changed stuff.

```
const myMonad = new MyMonad(12);
//myMonad === {value: 12, tag: "MyMonad", ....}

const anotherMyMonad = myMonad.fmap(x => x*2);
//anotherMyMonad === {value: 24, tag: "MyMonad", ....}
```

You can chain together the ".fmap" calls and do something like the following


```
const myMonad =
    new MyMonad(12) //value: 12
        .fmap(x => x*2) //value: 24
        .fmap(x => x+6) //value: 30
```


All well and good, but what if you need to change the type of monad the
stuff is in?  You use then.


```
const myMonad = new MyMonad(12);
//myMonad === {value: 12, tag: "MyMonad", ....}

const differentMonad = myMonad.then( x => new DifferentMonad(x.toString) )
//differentMonad === {someString: "12", theTag: "DifferentMonad", ...}
```

The above code doesn't make the reason for doing such a thing terribly clear,
but it really does turn out to be insanely useful for lots of problems.


And finally, some code using Maybe (which is a kind of monad)

```
//Map.get will return a Maybe<number>  If it has a value, assume it's 12
const maybeValue = Map.get(aMap, "someKey")
    .fmap( x => x*2 ) // If it has a value, the value is now 24
    .fmap( x => x + 6 ) //If it has a value, the value is now 30

//maybeValue is now "Just 30" or "Nothing"
```
