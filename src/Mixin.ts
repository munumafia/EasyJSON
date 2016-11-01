export default function mixin<TMixin, TTarget>(mixin : TMixin, target : TTarget) : TMixin & TTarget {
    let result = <TMixin & TTarget>{};
    let getProperties = (obj : any) => {
        return Object.getOwnPropertyNames(obj).concat(
            Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
        );
    }
    
    let targetKeys = getProperties(target);
    let mixinKeys = getProperties(mixin);

    targetKeys.forEach(id => {
        (<any>result)[id] = (<any>target)[id];        
    });

    mixinKeys.forEach(id => {
        if (!result[id]) (<any>result)[id] = (<any>mixin)[id];
    });

    return result;
}