(function() {
  const fs = require('fs');

  const componentsBasePath = "./components";

  const componentSymbol = Symbol("component");

  const Photon = {
    set style(styleName) {
      const styleHandlers = {
        auto() {
          // Fill style with platform related style name automatically
          Photon.style = {
            MacIntel: "cocoa"
          }[window.navigator.platform];
        },
        cocoa() {
          Photon.__setStyle("cocoa");
        },
        /*metro() {
          Photon.__setStyle("metro");
        }*/
      };
      if (styleName in styleHandlers) {
        styleHandlers[styleName]();
      }
      else {
        console.error("Style '" + styleName + "' is not supported.");
      }
    },
    __setStyle(styleName) {

      while (photonStyle.childNodes.length > 0) {
        photonStyle.removeChild(photonStyle.childNodes[0]);
      }

      for (let key in Photon) {
        const property = Photon[key];
        // If the property contains a valid component
        if (property && property[componentSymbol]) {
          // Get the compontents full path
          // let componentBaseDir = (this.__baseDir || __dirname + "/") + components[key];
          let componentBaseDir = 'node_modules/electron-photon' + "/" + components[key];
          // Get the stylesheet's full path
          let styleSheetPath = componentBaseDir + "/styles/" + styleName + ".css";
          // Make posix path working on non-unix systems
          styleSheetPath = styleSheetPath.replace(/\\/g, "/");

          // Append an @import statement to the styleheet of photon that refers to the components stylesheet
          photonStyle.append('@import "' + styleSheetPath.replace(/\\/g, "/") + '";');
        }
      }

    }
  };



  const components = {
    "Original": "dist/PhotonOriginal",
    "Button" : "dist/PhotonButton",
    "Custom": "dist/PhotonCustom",
    "Window": "dist/PhotonWindow",
    "WindowContent": "dist/PhotonWindowContent",
    "Toolbar": "dist/PhotonToolbar",
    "ButtonGroup": "dist/PhotonBtnGroup",
    "Tab": "dist/PhotonTab",
    "List": "dist/PhotonSwipe",
    "Content": "dist/PhotonContent",
    "Input": "dist/PhotonInput",
    "ProgressCircle": "dist/PhotonProgressCircle",
    "CircularSlider": "dist/PhotonCircularSlider",
    "Slider": "dist/PhotonSlider",
    "Panes": "dist/PhotonPanes",
    "Messages": "dist/PhotonMessages",
    "NumberInput": "dist/PhotonNumberInput",
    "Dialog": "dist/PhotonDialog",
    "DropDown": "dist/PhotonMenu",
    "Navigation": "dist/PhotonNavigation"
  };

  const photonStyle = document.createElement("style");
  document.head.append(photonStyle);




  // Loop trough compontents
  /*for (let componentName in components) {
    // If the key name relates to a real property
    if (components.hasOwnProperty(componentName)) {
      // Get the compontents full path
      let componentBaseDir = __dirname + "/" + components[componentName];
      // Require te compontent with CommonJS
      let component = require(componentBaseDir);
      // Set a back reference to Photon class to the component
      component.__self = Photon;
      component[componentSymbol] = true;
      // Set component as property of Photon class
      Object.defineProperty(Photon, componentName, {
        value: component,
        configurable: false,
        enumerable: true,
        writeable: false
      });

    }
  }*/

  Photon.Original = require("./dist/PhotonOriginal");
  Photon.Button = require("./dist/PhotonButton");
  Photon.Custom = require("./dist/PhotonCustom");
  Photon.Window = require("./dist/PhotonWindow");
  Photon.WindowContent = require("./dist/PhotonWindowContent");
  Photon.Toolbar = require("./dist/PhotonToolbar");
  Photon.ButtonGroup = require("./dist/PhotonBtnGroup");
  Photon.Tab = require("./dist/PhotonTab");
  Photon.List = require("./dist/PhotonSwipe");
  Photon.Content = require("./dist/PhotonContent");
  Photon.Input = require("./dist/PhotonInput");
  Photon.ProgressCircle = require("./dist/PhotonProgressCircle");
  Photon.CircularSlider = require("./dist/PhotonCircularSlider");
  Photon.Slider = require("./dist/PhotonSlider");
  Photon.Panes = require("./dist/PhotonPanes");
  Photon.Messages = require("./dist/PhotonMessages");
  Photon.NumberInput = require("./dist/PhotonNumberInput");
  Photon.Dialog = require("./dist/PhotonDialog");
  Photon.DropDown = require("./dist/PhotonMenu");
  Photon.Navigation = require("./dist/PhotonNavigation");

  // Set components back refernece to Photon (__self) and a symbol that indicates it as a component
  for (let componentName in Photon) {
    // Check wether the key is listed a property officially
    if (componentName in components) {
      Photon[componentName][componentSymbol] = true;
      Photon[componentName].__self = Photon;
    }
  }

  // Set auto synchronously if whe are running in node (then we can get the '__dirname' but if not, we have to use '__baseDir' which has to be set manually)
  // This means, we can not do this action synchronously but asynchrounusly
  if (!process.browser) {
    Photon.style = "auto";
  }
  // Do it asynchrounusly and check wether a '__baseDir' was set
  else {
    setTimeout(function() {
      if (Photon.__baseDir) {
        Photon.style = "auto";
      }
    }, 0);
  }


  if (window) {
    window.Photon = Photon;
  }
  module.exports = Photon;

})();
