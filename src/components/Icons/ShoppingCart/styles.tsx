import { Box, styled } from "@mui/material";

const transitionTime = "0.7s";
export const ShoppingCarWrapper = styled(Box)`
  position: relative;
  overflow: hidden;

  &.active {
    & .List {
      top: 0px;
    }
    & .Cart {
      left: -70px;
    }
    & .Item1 {
      left: 70px;
      top: -20px;
      rotate: 90deg;
    }
    & .Item3 {
      left: 0px;
      top: -20px;
      rotate: -90deg;
    }
    & .Item2 {
      top: -30px;
    }
  }
`;

export const Cart = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 55px;
  z-index: 5;
  transition: ${transitionTime};
  left: 0px;
`;

export const List = styled(Box)`
  position: absolute;
  transition: ${transitionTime};
  top: 60px;
  z-index: 6;
`;

const itemDefault = `position: absolute;
  display: flex;

  background-color: #CCC;
  flex-direction: column;
  width: 16px;
  height: 20px;
  left: 20px;
  top: 6.5px;
  border-radius: 4px;
  z-index: 2; 
  outline: 2px solid #212331;
  transition: ${transitionTime};

  &::before {
    content: "";
    width: 7px;
    height: 2px;
    left: 4.5px;
    top: 2.5px;
    border-radius: 3px;
    background-color: #212331;
    position: absolute;
    }`;

export const Item1 = styled(Box)`
  ${itemDefault}
`;

export const Item2 = styled(Box)`
  ${itemDefault}
  top: 1px;
  left: 26.5px;
`;

export const Item3 = styled(Box)`
  ${itemDefault}
  top: 5px;
  left: 31px;
`;
