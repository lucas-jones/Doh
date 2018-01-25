export default class Utils
{
    public static formatPrice(price:number):string
    {
        let result:string = "N/A";

        if (price < 0.01) result = price.toFixed(4)
        else if (price < 1) result = price.toFixed(2)
        else if (price < 10) result = price.toFixed(2)
        else if (price < 100) result = price.toFixed(2)
        else result = price.toFixed(0);

        return parseFloat(result).toLocaleString();
    }

    public static formatPercent(value:number):string
    {
        return value > 0 ? 'green' : 'red';
    }
}