describe("Http Request with `contentType` set to `form-urlencoded`", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    it("should URL encode the body", function () {
        server.respondWith("POST", "/foo", function (xhr) {
            expect(xhr.requestBody).to.equal("foo=1&foo=2&bar=3+4");
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, "{\"ok\":true}");
        });

        var request = new Http.Request({
            method: "POST",
            url: "/foo",
            body: {
                foo: [1, 2],
                bar: "3 4",
            },
        });

        return request.send().then(function (result) {
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.eql({ ok: true });
            expect(result.headers["Content-Type"]).to.equal("application/json");
        });
    });
});
