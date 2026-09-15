import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps";

// react-simple-maps forwards plain SVG presentation attributes, which cannot
// resolve CSS custom properties. These literals mirror the tokens in
// src/styles/_tokens.scss — keep them in sync.
const LAND = "#1a1f2e";
const LAND_STROKE = "rgba(237, 233, 224, 0.22)";
const ORIGIN = "#c0392b";

const ORIGIN_COORDS = [96.199379, 16.871311]; // Yangon
const ORIGIN_NAME = "Myanmar";

const Map = () => {
  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [-30.0, -10.0, 10],
        center: ORIGIN_COORDS,
        scale: 400,
      }}
      // Decorative: the "based in Yangon" caption carries the meaning.
      aria-hidden="true"
      focusable="false"
      style={{ width: "100%", height: "100%" }}
    >
      <Geographies geography="/features.json">
        {({ geographies }) =>
          geographies.map((geo) => {
            const isOrigin = geo.properties?.name === ORIGIN_NAME;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className={isOrigin ? "map__geo map__geo--origin" : "map__geo"}
                fill={isOrigin ? ORIGIN : LAND}
                stroke={LAND_STROKE}
                strokeWidth={0.4}
              />
            );
          })
        }
      </Geographies>

      <Annotation
        subject={ORIGIN_COORDS}
        dx={26}
        dy={-22}
        connectorProps={{
          stroke: ORIGIN,
          strokeWidth: 1,
          strokeLinecap: "round",
        }}
      >
        <text
          x="4"
          textAnchor="start"
          alignmentBaseline="middle"
          fill="#ede9e0"
          fontSize={11}
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="1.5"
        >
          YANGON
        </text>
      </Annotation>
    </ComposableMap>
  );
};

export default Map;
