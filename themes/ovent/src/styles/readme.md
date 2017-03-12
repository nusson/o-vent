# what is what

we put styles direclty within a react component.
Styles will be required by his component.
Then, webpack will extract those style and merge them into a single css file

## generic styles

because you'll need default style, this is the place :

+ `main.scss`: style entry point
  - it's the generic stuff like reset, transitions etc
  - it isn't styles that match a component
+ `/includes`: styles includes by `main.scss`
  - reset, transitions, fonts etc...
+ `/utils`: not style but sass stuff (vars, mixins etc)
  - can be imported by some component's style

## component styles

The rest of styles are within components.
For exemple, an article :

+ `components/Article/`
  - `index.tsx` = js class (dom + logic)
  - `styles.scss` = Article component related style

For convenience, the basepath for import will be `/src/styles`
so you can import vars easily (`@import 'utils/all';`)

