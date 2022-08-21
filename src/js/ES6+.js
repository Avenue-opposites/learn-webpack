let p = new Promise(res => {
    res('Promise');
});
async function test() {
    let result = await p;    
    return result;
};
export default {
    test
};

