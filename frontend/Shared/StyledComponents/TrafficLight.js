import styled, { css } from "styled-components";

const TrafficLight = styled.View`
  border-radius: 100px;
  width: 20px;
  height: 20px;
  padding: 20px;

  ${(props) =>
    props.available &&
    css`
      background: #afec1a;
    `}

  ${(props) =>
    props.limited &&
    css`
      background: #ffe033;
    `}

    ${(props) =>
    props.unavailable &&
    css`
      background: #ec241a;
    `}
`;

export default TrafficLight;