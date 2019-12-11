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
import * as Functor from "../Functor";

class StringMonad implements Monad.Monad<string> {
    constructor(readonly value: string){}

    bind<Vo>(bindFunction: (value: string) => Monad.Monad<Vo>): Monad.Monad<Vo> {
	return bindFunction(this.value);
    }

    seq<Vo>(sequenceFunction: () => Monad.Monad<Vo>): Monad.Monad<Vo> {
	return sequenceFunction();
    }

    then<Vo>(bindOrSequenceFunction: Monad.BindFunction<string, Vo> | Monad.SequenceFunction<Vo>): Monad.Monad<Vo> {
	return Monad.defaultThen(this.value, bindOrSequenceFunction)
    }

    fmap<Vo>(fmapFunction: (originalValue: Functor.FmapFunction<string, Vo>)): Monad.Monad<Vo>
}


class NumberMonad implements Monad.Monad<number> {
    constructor(readonly numericValue: number){}

    bind<Vo>(bindFunction: (value: number) => Monad.Monad<Vo>): Monad.Monad<Vo> {
	return bindFunction(this.numericValue);
    }

    seq<Vo>(sequenceFunction: () => Monad.Monad<Vo>): Monad.Monad<Vo> {
	return sequenceFunction();
    }

    then<Vo>(bindOrSequenceFunction: Monad.BindFunction<number, Vo> | Monad.SequenceFunction<Vo>): Monad.Monad<Vo> {
	return Monad.defaultThen(this.numericValue, bindOrSequenceFunction)
    }    
}




test("Can be implemented", () => {
    const sm: StringMonad = new StringMonad("Hello");

    expect(sm.value).toBe("Hello");
});


test("Then works with a bind function", () => {
    const sm: StringMonad = new StringMonad("Hello")
	.then( (value: string) => new StringMonad(value + " World") ) as StringMonad;

    expect(sm.value).toBe("Hello World");
});

test("Then works with a sequence function", () => {
    const sm: StringMonad = new StringMonad("Hello")
	.then( () => new StringMonad("Other Value") ) as StringMonad;

    expect(sm.value ).toBe("Other Value");
});


test("Then can call a bind function which returns a different kind of monad", () => {
    const m: NumberMonad = new StringMonad("Hello")
	.then( (value: string) => new NumberMonad(value.length) ) as NumberMonad;

    expect( (m as NumberMonad).numericValue ).toBe(5);
});


test("Then can call a sequence function which returns a different kind of monad", () => {
    const m: NumberMonad = new StringMonad("Hello")
	.then( () => new NumberMonad(8) ) as NumberMonad

    expect( (m as NumberMonad).numericValue ).toBe(8);
});
