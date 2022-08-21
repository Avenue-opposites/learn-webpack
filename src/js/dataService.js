const dataService = (function() {
    const name = "dataService";
    function save(...data) {
        let s = new Set();
        data.filter(value => {
            s.add(value);
        });
        return s;
    }
    return {
        name,
        save
    }
})();

export default dataService;
