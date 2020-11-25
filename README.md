[![tgiardina](https://circleci.com/gh/tgiardina/gdonkey-translators.svg?style=shield)](https://circleci.com/gh/tgiardina/gdonkey-translators.svg?style=shield)

# GDonkey Translators
Shims that translate complex site-dependent events into simple method calls that the GDonkey extension understands.

## Want to use GDonkey with your favorite site?

Submit an issue with the site's URL, and we will add support ASAP! 

We also welcome PRs! Submit an issue, code up your shim, and we will included it in the next release of GDonkey! For more development advice, see [the development guide](#development-guide)

### Development Guide

We recommed a 7-step development process:

1. Understand GDonkey's `Curator`.
    - See the [Understand `Curator`](#understand-curator) section.
2. Understand how the site communicates with your browser.
    - See the [Understand the site](#understand-the-site) section).
3. Understand the structure of a GDonkey translator 
    - See the [Understand the structure of a GDonkey translator](#understand-the-structure-of-a-gdonkey-translator) section.
4. Code up the `config` and `parse` files 
    - See GPokr's [config](https://github.com/tgiardina/gdonkey-translators/blob/master/src/translators/gpokr/config.ts) and [parse](https://github.com/tgiardina/gdonkey-translators/blob/master/src/translators/gpokr/parse.ts) files for examples.
5. Create a `GameEvent` interface.
    - See GPokr's [types](https://github.com/tgiardina/gdonkey-translators/tree/master/src/translators/gpokr/types) for examples.
6. Write tests for how you expect each `GameEvent` to be handled.
    - See GPokr's [tests](https://github.com/tgiardina/gdonkey-translators/blob/master/src/translators/gpokr/translator/Translator.test.ts) for examples.
7. Develop the `Translator`.
   - See GPokr's [Translator](https://github.com/tgiardina/gdonkey-translators/blob/master/src/translators/gpokr/translator/Translator.ts) for examples.

#### Understand `Curator`

Before you start, you should check out the [`Curator` interface](https://github.com/tgiardina/gdonkey-translators/blob/master/src/interfaces/Curator.ts). These methods will be how you communicate to GDonkey.

#### Understand the site

Before developing your translator, you will need to have a good understanding of how the site works. For example, how does the site tell you when someone bets? It sends a message from its servers to your browser. We need to figure out what those messages are and how they're being sent.

Fortunately, GDonkey has a simple debugger that allows us to sniff these messages. Go to [GDonkey Debugger](https://github.com/tgiardina/gdonkey-debugger) and set it up for the site you're interested in. Using the debugger, try to answer these questions:

- Is the site using HTTP requests or a WebSocket?
- Which messages correspond to which `Curator` methods. (Note: some messages might correspond to many method calls!)
- Do all relevant messages have similar structure? E.g., something like
    ```
    {
      event: {
        id: "FlopEvent",
        ....
      }
    } 
    ```
Take note of your answers, because they will be useful later on!

#### Understand the structure of a GDonkey translator

Now that you know how the site you're interested in communicates, let's talk about how to build a translator.  A translator needs three things:

1. `config` - A file with info about the site
   - `name: string` - The name of the site.
   - `srcUrls: string[]` - A list of globs capturing all of the site's poker tables.
   - `targetUrls: string[]` - A list of globs capturing all of the event endpoints. 
   - `hasImplicitBlinds?: boolean` - Is there an event for when someone posts a blind? Or does the client handle it implicitly?
    - `isAnon?: boolean` - Does the site use names?
2. `parse` - A function that extracts the events and returns them as a list
    - Must return a list. Will most likely be of the form `(json: string) => object[]`
4. `Translator` - A class that implements a `translate` method. 
   - `Translator`'s constructor must take one and only param: the `Curator`. 
   - `translate` should take an event object and make the appropriate calls to `this.curator`.
   - `Translator` should contain no state (other than `this.curator`.



For examples, check out the [currently implemented translators](https://github.com/tgiardina/gdonkey-translators/tree/master/src/translators). 

