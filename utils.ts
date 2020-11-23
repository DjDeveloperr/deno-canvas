export function dataURLtoFile(dataurl: string) {
    let arr: string[] = dataurl.split(',');
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let data = new Uint8Array(n);
    while(n--){
        data[n] = bstr.charCodeAt(n);
    }
    return data;
}