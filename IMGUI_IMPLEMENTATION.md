# ImGui Implementation Documentation

## Overview

This implementation adds an ImGui-style UI panel to the 3D CSS renderer, allowing real-time viewing of framerates and adjustment of rendering parameters.

## Features

### 1. FPS Counter
- Real-time framerate monitoring
- Color-coded display:
  - **Green**: ≥30 FPS (good performance)
  - **Orange**: 15-29 FPS (medium performance)  
  - **Red**: <15 FPS (poor performance)

### 2. Statistics Display
- **FPS**: Current frames per second
- **Triangles**: Number of triangles being rendered

### 3. Adjustable Parameters

#### Rotation Controls
- **Auto Rotate**: Toggle automatic rotation on/off
- **Rotation Speed**: Adjust rotation speed (0.1 to 5.0)

#### Camera Controls
- **FOV**: Field of view (30° to 150°)
- **Camera Z**: Camera depth position (100 to 600)
- **Camera Y**: Camera vertical position (-200 to 400)

#### Lighting Controls
- **Diffuse Intensity**: Controls diffuse lighting strength (0.5 to 10)
- **Diffuse Offset**: Base diffuse lighting value (0 to 150)
- **Specular Power**: Shininess/specular power (1 to 50)
- **Specular Intensity**: Specular highlight intensity (0 to 3000)

#### Model Selection
- **Model**: Switch between available models (Teapot, Teddy)
- **Reset Rotation**: Reset rotation angle to 0

## Files Added

### imgui.css
Styling for the ImGui panel with dark theme and modern aesthetics.

### imgui.js
Core ImGui implementation providing:
- Panel creation and management
- FPS tracking and display
- UI controls (sliders, checkboxes, buttons, dropdowns)
- Real-time parameter updates

### Modified Files

#### index.html
- Added link to `imgui.css` stylesheet

#### script.js
- Imported ImGui module
- Added `params` object to centralize all adjustable parameters
- Updated rendering code to use parameters from `params` object
- Refactored model loading into reusable `loadModel()` function
- Integrated ImGui UI initialization and setup
- Connected UI controls to rendering parameters

## Usage

Open `index.html` in a web browser. The ImGui panel appears in the top-right corner with:

1. **Stats Section**: View current FPS and triangle count
2. **Rotation Section**: Control rotation behavior
3. **Camera Section**: Adjust camera position and perspective
4. **Lighting Section**: Fine-tune lighting parameters
5. **Model Section**: Switch models and reset rotation

All changes take effect immediately in real-time.

## Technical Implementation

### FPS Tracking
Uses `requestAnimationFrame()` to accurately measure framerate by counting frames within 1-second windows.

### Parameter System
Centralized `params` object allows easy parameter management and UI binding.

### Real-time Updates
All UI controls use callbacks that immediately update the `params` object, affecting the next render frame.

### Model Loading
Asynchronous model loading function that clears the scene, loads the new OBJ file, and recreates the triangle mesh.

## Browser Compatibility

Tested with modern browsers supporting:
- ES6 modules
- CSS custom properties
- Range input controls
- requestAnimationFrame API
