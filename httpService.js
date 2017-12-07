brandLabel.service('httpService', httpService);

function httpService($rootScope, $http) {

    this.get = function(url) {
        return $http({
            url: API_URL + url,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    this.post = function(url, data) {

        return $http({
            url: API_URL + url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    };

    this.put = function(url, data) {
        console.log("inside httpService ---put method");
        console.log("url=", API_URL + url);
        return $http({
            url: API_URL + url,
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    };

    this.delete = function(url) {
        return $http({
            url: API_URL + url,
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    this.secureGet = function(url) {
        return $http({
            url: API_URL + url,
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    this.securePost = function(url, data) {

        return $http({
            url: API_URL + url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    };

    this.securePut = function(url, data) {
        console.log("inside httpService ---put method");
        console.log("url=", API_URL + url);
        return $http({
            url: API_URL + url,
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    };


    this.secureDelete = function(url) {
        return $http({
            url: API_URL + url,
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    this.filePost = function(url, data) {
        return $http({
            url: API_URL + url,
            method: "POST",
            headers: {
                'Content-Type': undefined,
                'x-access-token': $rootScope.xToken,
                'x-key': $rootScope.xKey
            },
            data: data
        });
    };

    this.filePut = function(url, data) {
        return $http({
            url: API_URL + url,
            method: "PUT",
            headers: {
                'Content-Type': undefined,
                'x-access-token': $rootScope.xToken,
                'x-key': $rootScope.xKey
            },
            data: data
        });
    };



};