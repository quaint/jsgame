import Trailer from "./trailer";

export default interface Is_using_trailer {
    updateTrailer(timeDiff: number, trailer: Trailer): void;
}