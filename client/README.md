# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# Stuff to do with my app

## "Database" structure for accessing model options in the app

ModelsObject as modelOptions: {
  partOptions: {
    partGroups: {
      groupName: [{...various children}]
    }
  }
}

Example, for the Digital configuration:

ModelsObject: {
  face: {
    digital: {
      ...display: [{...all parts of the model to do with the display}]
    },
    analogue_1: {
      ...display: [{...all parts of the model to do with the buttons}]
    },
    analogue_2: {
      ...display: [{...all parts of the model to do with the buttons}]
    }
  },
  housing: {
    button: {
      ...housing: [{...all parts to do with housing}]
    },
    noButton: {
      ...housing: [{...all screw objects in the model}]
    }
  },
  strap: {
    cotton: {
      ...buckle: [{...all parts to do with the buckle}]
    },
    rubber: {
      ...buckle: [{...all parts to do with the buckle}]
    },
  },
  casing: {
    button: {
      ...screws: [{...all screw objects in the model}]
    },
    noButton: {
      ...screws: [{...all screw objects in the model}]
    }
  }
}