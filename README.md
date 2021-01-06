# Laravel DebugBar Companion

A Laravel DebugBar companion app that helps you debug your applications.

![](https://beyondco.de/github/laravel-debugbar-companion/companion.png)

## Installation

You can download the latest version of this application for MacOS, Windows, and Linux on the [releases page](https://github.com/beyondcode/laravel-debugbar-companion/releases).

The new `socket` storage driver is already available in the `master` branch of the Laravel Debugbar. If you don't want to use the master branch, you can already use this app in combination with this custom storage provider:

```php
<?php
namespace App;

use DebugBar\Storage\StorageInterface;

class SocketStorage implements StorageInterface
{
    protected $socket;
    /**
     * @inheritDoc
     */
    function save($id, $data)
    {
        $socketIsFresh = !$this->socket;
        if (!$this->socket = $this->socket ?: $this->createSocket()) {
            return false;
        }
        $encodedPayload = json_encode([
            'id' => $id,
            'base_path' => base_path(),
            'app' => config('app.name'),
            'data' => $data,
        ]);
        $encodedPayload = strlen($encodedPayload).'#'.$encodedPayload;
        set_error_handler([self::class, 'nullErrorHandler']);
        try {
            if (-1 !== stream_socket_sendto($this->socket, $encodedPayload)) {
                return true;
            }
            if (!$socketIsFresh) {
                stream_socket_shutdown($this->socket, \STREAM_SHUT_RDWR);
                fclose($this->socket);
                $this->socket = $this->createSocket();
            }
            if (-1 !== stream_socket_sendto($this->socket, $encodedPayload)) {
                return true;
            }
        } finally {
            restore_error_handler();
        }
    }
    private static function nullErrorHandler($t, $m)
    {
        // no-op
    }
    protected function createSocket()
    {
        set_error_handler([self::class, 'nullErrorHandler']);
        try {
            return stream_socket_client('tcp://'.config('debugbar.storage.host', '127.0.0.1').':'.config('debugbar.storage.port', 2304));
        } finally {
            restore_error_handler();
        }
    }
    /**
     * @inheritDoc
     */
    function get($id)
    {
        //
    }
    /**
     * @inheritDoc
     */
    function find(array $filters = array(), $max = 20, $offset = 0)
    {
        //
    }
    /**
     * @inheritDoc
     */
    function clear()
    {
        //
    }
}
```

Just place it in you `app` directory and configure the debugbar in your `config/debugbar.php` file like this:

```php
'storage' => [
    'enabled'    => true,
    'driver'     => 'custom', // redis, file, pdo, custom
    'provider'   => \App\SocketStorage::class, // Instance of StorageInterface for custom driver
],
```

### Contributing

To get the application running locally, first install all required dependencies using `yarn`.

The application can be started in development mode using:

```
yarn electron:serve
```

This will start the application in a hot-reloading mode, so all changes will be immediately visible within the application.

### Security

If you discover any security related issues, please email marcel@beyondco.de instead of using the issue tracker.

## Credits

- [Marcel Pociot](https://github.com/mpociot)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.