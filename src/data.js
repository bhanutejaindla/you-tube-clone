export const API_KEY="AIzaSyAlFeWNrmHkFBjNhtV7iPQ4a0PKm4S9bUo"

export const value_converter =(value) =>{
    if(value>=1000000)
        {
            return Math.floor(value/1000000)+"M";
        }
        else if(value>=1000)
            {
                return Math.floor(value/1000)+"K";
            }
        else
        {
            return value;
        }
}