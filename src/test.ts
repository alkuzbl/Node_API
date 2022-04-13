function Component(id: number) {
    console.log('init')
    return (target: Function) => {
        console.log('run')
        target.prototype.id = id
    }
}

function Logger() {
    console.log('init logger')
    return (target: Function) => {
        console.log('run logger')
    }
}

function Method(
    target: Object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
) {
    console.log(propertyKey)
    propertyDescriptor.value = function (...args: any[]) {
        return args[0] * 10
    }
}

function Param(
    target: Object,
    propertyKey: string,
    index: number
) {
    console.log(propertyKey, index)

}

function Prop(
    target: Object,
    propertyKey: string,
) {
    let value: number;
    console.log(propertyKey)

    const getter = () => {
        console.log('Get')
        return value
    };

    const setter = (newValue: number) => {
        console.log('Set')
        value = newValue
    }

    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter
    })

}

@Logger()
@Component(1)
export class User {
    @Prop id: number

    @Method
    updatedId(@Param newId: number) {
        this.id = newId
        return this.id
    }
}

console.log(new User().id)
console.log(new User().updatedId(2))
