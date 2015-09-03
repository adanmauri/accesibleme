accesibleme 0.3.0
=================

Basic useful feature list:

 * All native javascript based functions
 * Simple DOM queries 
 * Color operations

Implemented but not uploaded:

 * accesibleme panel
 * accesibleme validator

#Make a query!

## Select queries

**Description**: *Accepts a string containing a CSS selector which is then used to match a set of elements.*

```javascript
/* Select DOM elements */
var elem = accesibleme.query( selector [, context] );
```

**selector**: A string containing a selector expression.

**context [optional]**: A DOM Element, Document. Start point of the query.

**return valu**: An accesibleme object.

### Examples

```javascript
/* Select all div elements */
var elems0 = accesibleme.query( "div" );

/* Select all elements with classname "mi_clase" */
var elems1 = accesibleme.query( ".mi_clase" );

/* Select the element with id "mi_id" */
var elem = accesibleme.query( "#mi_id" );
```

## CSS operations

**Description**: *Get the value of a style property for the first element in the set of matched elements or set one or more CSS properties for every matched element.*

```javascript
/* Select DOM elements */
var elem = accesibleme.query( selector [, context] );
```

- **selector**: A string containing a selector expression.
- **context [optional]**: A DOM Element, Document.
- **return**: An accesibleme object.

### Examples

```javascript
/* Get property */
var property = accesibleme.query( selector ).css( propertyName );

/* Set property */
var property = accesibleme.query( selector ).css( propertyName, value );
```

- **propertyName**: A CSS property.
- **value**: A value to set for the property.
- **return value**: An property as string.

# Color operations

## The accesibleme.colors object


```javascript
/* Create an accesibleme.colors object */
var color = accesibleme.colors( color );
```
- **color**: A string containing a CSS color string, or a basic color object.
- **Return value**: An accesibleme.color object.

### String format colors allowed
- **named**: like ```red```, ```blue```, ```green```
- **hex**: ```F70```, ```#F70```, ```FF7700```, ```#FF7700```, or with alpha: ```#F70FA```, ```F70FA```, ```#FF7700F```, ```FF7700FF ``
- **rgb**: ```rgb(255, 127, 0)```, or ```rgb( 100%, 50%, 0)```
- **rgba**: ```rgba(255, 127, 0, 0.5)```, or ```rgba( 100%, 50%, 0%, 0.5)```
- **hsl**: ```hsl(39, 100%, 50%)```
- **hsla**: ```hsla(39, 100%, 50%)```

### Object format colors allowed
- **hex**: ```{ format:hex, rh:FF, gh:AA, bh:00 }```, or with alpha ```{ format:hex, rh:"FF, gh:AA, bh:"00, ha:FF }```
- **rgb**: ```{ format: rgb, r:255, g:127, b:0}```, or ```{ format: rgb, r:100%, g:50%, b:0%}```
- **rgba**: ```{ format: rgba, r:255, g:127, b:0, a:0.5 }```, or ```{ format: rgba, r:100%, h:50%, b:0%, a:0.5}```
- **hsl**: ```{ format: hsl, h:39, s:100%, l:50%}```, or ```{ format: hsl, h:39, s:100%, l:50% }```
- **hsla**: ```{ format: hsl, h:39, s:100%, l:50%, a:0.5 }```, or ```{ format: hsl, h:39, s:100%, l:50%, a:0.5}```

### Examples

```javascript
/* Create an accesibleme.colors object with CSS color string */
var color1 = accesibleme.colors( "rgb(255, 0, 0)" );

/* Create an accesibleme.colors object with basic color object */
var color2 = accesibleme.query( {format:"rgb", r:255, g:0, b:0} );

/* Clone an accesibleme.colors object */
var color3 = color.clone();
```

## stringDetectFormat()

**Description**: *Detect the color format and return it as string.*

```javascript
/* Detect with an accesibleme.colors object */
var color = accesibleme.colors( "rgb(255, 175, 128=" );
console.log(color.stringDetectFormat()); // rgb

/* Detect without accesibleme.colors object */
console.log(accesibleme.colors().stringDetectFormat( "#F7A" )); // hex
```

## .stringToArray()

**Description**: *Return the converted color as a string with CSS format.*

```javascript
/* Return without accesibleme.colors object */
console.log(accesibleme.colors().stringDetectFormat( "hsl(39, 100%, 50%)", "rgb" )); // rgb(255, 165, 0)
```

## .to[format]AsObject()

**Description**: *Return the converted color as a simple color object*

```javascript
/* Return as Rgb */
object.toRgbAsObject([alpha])
```
- **[alpha]**: Boolean value. If defined, return the object with or without alpha value; if not, return the object with the original color state.

### Example

```javascript
var color = accesibleme.colors( { format: rgb, r:255, g:255, b:255 } );

/* Return as hex */
console.log(color.toHexAsObject());      // { format: hex, hr:FF, hg:FF, hb: FF }
console.log(color.toHexAsObject(true));  // { format: hex, hr:FF, hg:FF, hb: FF, ha: FF }
console.log(color.toHexAsObject(false)); // { format: hex, hr:FF, hg:FF, hb: FF }

/* Return as rgb */
console.log(color.toRgbAsObject());      // { format: rgb, r:255, g:255, b: 255 }
console.log(color.toRgbAsObject(true));  // { format: rgba, r:255, g:255, b: 255, a:1 }
console.log(color.toRgbAsObject(false)); // { format: rgba, r:255, g:255, b: 255, a:1 }

/* Return as hsl */
console.log(color.toHslAsObject());      // { format: hsl, h:360, s: 100%, l: 100%)
console.log(color.toHslAsObject(true));  // { format: hsla, h:360, s: 100%, l: 100%, a:1 }
console.log(color.toHslAsObject(false)); // { format: hsl, h:360, s: 100%, l: 100% }
```

## .to[format]AsString()

**Description**: *Return the converted color as a string with CSS format.*

```javascript
/* Return as Rgb */
object.toRgbAsObject([alpha])
```
- **[alpha]**: Boolean value. If defined, return the object with or without alpha value; if not, return the object with the original color state.

### Example

```javascript
var color = accesibleme.colors( { format: rgb, r:255, g:255, b:255 } );

/* Return as hex */
console.log(color.toHexAsString());      // #FFFFFF
console.log(color.toHexAsString(true));  // #FFFFFFFF
console.log(color.toHexAsString(false)); // #FFFFFF

/* Return as rgb */
console.log(color.toRgbAsString());      // rgb(255, 255, 255)
console.log(color.toRgbAsString(true));  // rgba(255, 255, 255, 1)
console.log(color.toRgbAsString(false)); // rgb(255, 255, 255)

/* Return as hls */
console.log(color.toHslAsString());      // hsl(360, 100%, 100%)
console.log(color.toHslAsString(true));  // hsla(360, 100%, 100%, 1)
console.log(color.toHslAsString(false)); // hsl(360, 100%, 100%)
```

## .to[format]AsString()

**Description**: *Return the converted color as a string with CSS format.*

```javascript
/* Return as Rgb */
object.toRgbAsObject([alpha])
```
- **[alpha]**: Boolean value. If defined, return the object with or without alpha value; if not, return the object with the original color state.

### Example

```javascript
var color = accesibleme.colors( { format: rgb, r:255, g:255, b:255 } );

/* Return as hex */
console.log(color.toHexAsString());      // #FFFFFF
console.log(color.toHexAsString(true));  // #FFFFFFFF
console.log(color.toHexAsString(false)); // #FFFFFF

/* Return as rgb */
console.log(color.toRgbAsString());      // rgb(255, 255, 255)
console.log(color.toRgbAsString(true));  // rgba(255, 255, 255, 1)
console.log(color.toRgbAsString(false)); // rgb(255, 255, 255)

/* Return as hls */
console.log(color.toHslAsString());      // hsl(360, 100%, 100%)
console.log(color.toHslAsString(true));  // hsla(360, 100%, 100%, 1)
console.log(color.toHslAsString(false)); // hsl(360, 100%, 100%)
```

## Implemented functions to document
### .toLuminance()
Calcule the color luminance
### .getRelativeLuminance()
Calcule the relative color luminance (important to calculate contrast)
### .getContrastTo(color)
Calcule the contrast between two colors (important to WCAG validation)
### .getNegative()
Calcule the negative color