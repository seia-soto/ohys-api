Ohys-API
========

The package refining the Ohys-Raws distribution data.

I implemented the code in TypeScript and ES module for better community
adoption of newer technologies. Supporting CommonJS module or legacies
will not be supported in any way.

[Install]

You can install the package via NPM.

$ npm i ohys-api

[API]

We removed all APIs rather than title parsing method for smaller package
footprint. Almost everyone use their own HTTP requesting package, so it's
reasonable to take over the package selection to the user world.

> parser.parse(title: string): { ... }

```javascript
import { parser } from 'ohys-api'

parser('[PROVIDER] Title 2nd season - 2 END (CH 1920x1080 x264 AAC)')
/*
{
  title: {
    original: 'Title',
    seasonal: 'Title 2nd season',
    series: '',
  },
  file: {
    name: '[PROVIDER] Title 2nd season - 2 END (CH 1920x1080 x264 AAC)',
    resolution: '1920x1080',
    codec: {
      video: 'x264',
      audio: 'AAC',
    },
  },
  provider: {
    channel: 'CH',
  },
  episodes: [2],
  seasons: [2],
}
*/
```

We also bundle some development only method for dynamic use of this
package, but don't use development only methods in production code. Even
in minor version changes, the development only methods can be changed at
any time.

Please, see test directory for the use of development only method.

[LICENSE]

All code rights goes to HoJeong Go <seia@outlook.kr>, the owner.
All code distributed in ISC license for free use of the code.

Don't abuse the names in this package.
Don't hide the credit of this package if you used or transformed the code
in this package.
Don't hate others by any specific reason.
