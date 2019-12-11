/*
 * Copyright 2019 Charles Shuller
 *
 * This file is part of fts-monad.
 *
 * fts-monad is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * fts-monad is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with fts-monad.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as Monad from "../Monad";
import * as Functor from "fts-functor";

class TestMonad<V> implements Monad.Monad<V> {
    constructor(readonly value: V){}

    bind<Vo>(bindFunction: Monad.BindFunction<V, Vo>): Monad.Monad<Vo> {
	return bindFunction(this.value);
    }

    seq<Vo>(sequenceFunction: Monad.SequenceFunction<Vo>): Monad.Monad<Vo> {
	return sequenceFunction();
    }

    then<Vo>(bindOrSequenceFunction: Monad.BindFunction<V, Vo> | Monad.SequenceFunction<Vo>): Monad.Monad<Vo> {
	return Monad.defaultThen(this.value, bindOrSequenceFunction)
    }

    fmap<Vo>(fmapFunction: Functor.FmapFunction<V, Vo>): TestMonad<Vo>{
        return new TestMonad( fmapFunction(this.value) );
    }
}


class TestMonad2<V> implements Monad.Monad<V> {
    constructor(readonly value: V){}

    bind<Vo>(bindFunction: Monad.BindFunction<V, Vo>): Monad.Monad<Vo> {
	return bindFunction(this.value);
    }

    seq<Vo>(sequenceFunction: Monad.SequenceFunction<Vo>): Monad.Monad<Vo> {
	return sequenceFunction();
    }

    then<Vo>(bindOrSequenceFunction: Monad.BindFunction<V, Vo> | Monad.SequenceFunction<Vo>): Monad.Monad<Vo> {
	return Monad.defaultThen(this.value, bindOrSequenceFunction)
    }

    fmap<Vo>(fmapFunction: Functor.FmapFunction<V, Vo>): TestMonad<Vo>{
        return new TestMonad( fmapFunction(this.value) );
    }
}



test("Can be implemented", () => {
    const tm = new TestMonad<string>("Hello");

    expect(tm.value).toBe("Hello");
});


test("'then' works with a bind function", () => {
    const tm = new TestMonad("Hello")
	.then( (value: string) => new TestMonad<string>(value + " World") ) as TestMonad<string>;

    expect(tm.value).toBe("Hello World");
});

test("bind works", () => {
    const tm = new TestMonad("Hello")
	.bind( (value: string) => new TestMonad<string>(value + " World") ) as TestMonad<string>;

    expect(tm.value).toBe("Hello World");
});



test("'then' works with a sequence function", () => {
    const tm = new TestMonad<string>("Hello")
	.then( () => new TestMonad<string>("Other Value") ) as TestMonad<string>;

    expect(tm.value ).toBe("Other Value");
});


test("seq works", () => {
    const tm = new TestMonad<string>("Hello")
	.seq( () => new TestMonad<string>("Other Value") ) as TestMonad<string>;

    expect(tm.value ).toBe("Other Value");
});


test("'then' can produce a different kind of monad", () => {
    const tm = new TestMonad("Hello")
	.then( (value: string) => new TestMonad2<string>(value + " World") ) as TestMonad2<string>;

    expect(tm.value).toBe("Hello World");
});


test("It can fmap a value", () => {
    const tm = new TestMonad<string>("12")
	.fmap( (value: string) => Number.parseInt(value) );

    expect(tm.value).toBe(12);
});
