module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                mac: {
                    hardenedRuntime: true,
                    entitlements: "./build/entitlements.mac.inherit.plist"
                },
                linux: {
                    target: ["AppImage"]
                },
                productName: "Laravel DebugBar",
                publish: ['github'],
                appId: "de.beyondco.laraveldebugbar",
                afterSign: "./notarize.js"
            },
            nodeIntegration: true
        }
    }
}