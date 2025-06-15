# Model designer app
This app is a way for users to configure colour schemes and designs for 3D models. This idea was borne out of a desire to design watches, but with some changes and refactoring, the logic can be used to modify colour schemes for anything.

Made out of React + Vite, with making use of Vercel for an API function for grabbing the 3D assets. Currently only designed for desktop - mobile and tablet layout coming soon

## How it works
A model was split into its composite parts (which can be a bit of a philosophical question) to generate the "options" for choosing, to be able to choose between alternate options. In the 3D models, each part visible part is given a name so that it can have its colour changed. The watch files follow this pattern; future models will have to follow the same pattern.

### "Database" structure for accessing model options in the app
With this pattern, the main object within the code for housing the options is as follows

```
ModelsObject as modelOptions: {
  partOptions: {
    partGroups: {
      groupName: [{...various children}]
    }
  }
}
```

Example, for a configuration to display a Digital watch:

```
ModelsObject: {
  face: {
    digital: {
      ...,
      display: [{...all parts of the model to do with the display}]
    },
    analogue_1: {
      ...,
      display: [{...all parts of the model to do with the buttons}]
    },
    analogue_2: {
      ...,
      display: [{...all parts of the model to do with the buttons}]
    }
  },
  housing: {
    button: {
      ...,
      housing: [{...all parts to do with housing}]
    },
    noButton: {
      ...,
      housing: [{...all screw objects in the model}]
    }
  },
  strap: {
    cotton: {
      ...,
      buckle: [{...all parts to do with the buckle}]
    },
    rubber: {
      ...,
      buckle: [{...all parts to do with the buckle}]
    },
  },
  casing: {
    button: {
      ...,
      screws: [{...all screw objects in the model}]
    },
    noButton: {
      ...,
      screws: [{...all screw objects in the model}]
    }
  }
}
```

### Additional logic
Depending on what you're designing and choosing from, certain combos of options don't make sense. In this case, it doesn't make sense to be able to choose the Digital Face option while selecting the casing for a Standard watch, as the Digital face physically doesn't fit. A ValidOptions check goes on to restrict the options available based on a particular logic. At present the ValidOptions for the type of G Shock modelled are hardcoded in. This logic can be abstracted should more varieties of model are added at a later date
