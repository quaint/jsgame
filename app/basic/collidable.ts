import Point from './point'
import Size from './size'
import Circle from './circle'

export default interface Collidable extends Circle {
    size: Size
    angle: number
    maxAngle: number
    getPin(): Point
}