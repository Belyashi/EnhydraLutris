(function () {
    angular
        .module('tofi')
        .factory('LocalStorage', localStorageFactory);

    function localStorageFactory() {
        return {
            store: store,
            retrieve: retrieve,
            remove: remove
        };

        function retrieve(name) {
            try {
                return localStorage.getItem(name);
            } catch (e) {
                return undefined;
            }
        }

        function store(name, value) {
            localStorage.setItem(name, value);
        }

        function remove(name){
            localStorage.removeItem(name);
        }
    }
})();