/**
 * Main module for the Monad type.
 *
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
 *
 */

import * as Functor from './Functor';


/**
 * BindFunctions are used for "Binding" a function to a monad, it's essentially
 * a form of function composition.  The terminology is borrowed from Haskell
 * where it is written as ">>=".
 *
 * Here, it is used to describe a function we pass to "bind" or "then"
 * functions.
 *
 * @typeparam Vi This is the input type, the type of the value of the monad.
 * @typeparam Vo This is the output type, the type of the value of the
 *               resultant monad.
 *
 * @param value This is the value of the monad bind is called against.
 */
export interface BindFunction<Vi, Vo> {
    (value: Vi): Monad<Vo>;
}

/**
 * SequenceFunctions are used when you want to keep a chain of "then's going, but
 * don't really care what the previous value was.  This is more required in Haskell
 * than typescipt, where it's used to ensure a() is called before b(), but still makes
 * some code nicer.
 *
 * @typeparam Vo This is the output type of the resultant Monad.
 */
export interface SequenceFunction<Vo> {
    (): Monad<Vo>;
}




/**
 * Interface used to define a Monad.  Mathmatically, Monads are
 * used to map functions into other functions.  For general use in
 * programming though, it's best to think of them as a collection of
 * functions.
 * 
 * For more through information on Monads, the reader is encouraged to
 * google search "Haskell Monad Introduction".
 *
 * @typeparam V This is the value type of the Monad
 */
export interface Monad<V> extends Functor.Functor<V> {
    bind<Vo>(bindFunction: BindFunction<V, Vo>): Monad<Vo>;
    seq<Vo>(sequenceFunction: SequenceFunction<Vo>): Monad<Vo>;
    
    then<Vo>(bindOrSequenceFunction: BindFunction<V, Vo> | SequenceFunction<Vo>): Monad<Vo>;
}

export function defaultThen<Vi, Vo>(value: Vi, bindOrSequenceFunction: BindFunction<Vi, Vo> | SequenceFunction<Vo>): Monad<Vo> {
    if(bindOrSequenceFunction.length === 0){
	return (bindOrSequenceFunction as SequenceFunction<Vo>)();
    } else {
	return (bindOrSequenceFunction as BindFunction<Vi, Vo>)(value);
    }
}


