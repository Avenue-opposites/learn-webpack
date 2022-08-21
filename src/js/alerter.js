const alerter = (function() {
    const name = "alerter";
    function alertPeople(who) {
        alert(`${who} 我叫你一声你敢答应吗？`);
    }
    return {
        name,
        alertPeople
    }
})();

export default alerter;