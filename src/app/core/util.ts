export class Util {

    private static arrayCoresEscalaVermelhoAmareloVerde = [
        "#F8696B",
        "#F86A6B",
        "#F86D6B",
        "#F86E6C",
        "#F86F6C",
        "#F8716C",
        "#F8726C",
        "#F8736D",
        "#F8756D",
        "#F8766D",
        "#F8786D",
        "#F8796E",
        "#F87A6E",
        "#F97C6E",
        "#F97D6E",
        "#F97E6F",
        "#F9806F",
        "#F9816F",
        "#F98370",
        "#F98470",
        "#F98570",
        "#F98770",
        "#F98871",
        "#F98971",
        "#F98B71",
        "#F98C71",
        "#F98D72",
        "#FA8F72",
        "#FA9072",
        "#FA9272",
        "#FA9373",
        "#FA9473",
        "#FA9673",
        "#FA9773",
        "#FA9874",
        "#FA9A74",
        "#FA9B74",
        "#FA9D75",
        "#FA9E75",
        "#FA9F75",
        "#FBA175",
        "#FBA276",
        "#FBA376",
        "#FBA576",
        "#FBA676",
        "#FBA777",
        "#FBA977",
        "#FBAA77",
        "#FBAC77",
        "#FBAD78",
        "#FBAE78",
        "#FBB078",
        "#FBB178",
        "#FBB279",
        "#FCB479",
        "#FCB579",
        "#FCB77A",
        "#FCB87A",
        "#FCB97A",
        "#FCBB7A",
        "#FCBC7B",
        "#FCBD7B",
        "#FCBF7B",
        "#FCC07B",
        "#FCC17C",
        "#FCC37C",
        "#FCC47C",
        "#FDC67C",
        "#FDC77D",
        "#FDC87D",
        "#FDCA7D",
        "#FDCB7D",
        "#FDCC7E",
        "#FDCE7E",
        "#FDCF7E",
        "#FDD17F",
        "#FDD27F",
        "#FDD37F",
        "#FDD57F",
        "#FDD680",
        "#FDD780",
        "#FED980",
        "#FEDA80",
        "#FEDB81",
        "#FEDD81",
        "#FEDE81",
        "#FEE081",
        "#FEE182",
        "#FEE282",
        "#FEE482",
        "#FEE582",
        "#FEE683",
        "#FEE883",
        "#FEE983",
        "#FFEB84",
        "#E0E383",
        "#C1DA81",
        "#A2D07F",
        "#83C77D",
        "#63BE7B"
    ];

    public static getCorEscalaVermelhoAmareloVerdeByPercentual(percentual) {
        if (percentual) {
            if (percentual > 100)
            return Util.arrayCoresEscalaVermelhoAmareloVerde[99];
            else if (percentual > 0)
            return Util.arrayCoresEscalaVermelhoAmareloVerde[Math.trunc(percentual)-1];
            else
            return Util.arrayCoresEscalaVermelhoAmareloVerde[0];
        }
        // return null;
        return Util.arrayCoresEscalaVermelhoAmareloVerde[0];
    }

    public static changeArrayOrder(array, indexA, indexB) {
        var temp = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = temp;
    }

    public static moveArrayIndex(array, indexA, indexB) {
        var temp = array[indexA];
        array.splice(indexA, 1);
        array.splice(indexB, 0, temp);
    }

 }