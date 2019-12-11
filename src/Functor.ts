export interface FmapFunction<Vi, Vo> {
    (originalValue: Vi): Vo;
}

export interface Functor<V> {
    fmap<Vo>( fmapFunction: FmapFunction<V, Vo> ): Functor<Vo>;
}
