import { Box, styled } from "@mui/material";

const pageHeight = 23; //23
const pageWidth = 20; //20
const pageDepth = 9; //10

export const RecipesWrapper = styled(Box)(() => ({
  height: "54px",
  width: "50px",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  transition: "1s",
  "&.active": {
    height: "59px",

    // HAT
    "& .hat": {
      "& .image-wrapper": {
        transition: "1s",
        top: "0px",
      },
      "& .hide-rat-transition": {
        transition: "1s",
        transform: "scaleY(1)",
      },
    },
    // BOOK
    "& .book": {
      transition: "1s",
      perspective: "100px",
      scale: "1.3",
      right: "10px",
      bottom: "-1px",
      "& .pages-left": {
        transition: "1s",
        transform: "rotateX(-70deg) rotateY(-10deg) translateZ(0px)",
      },
      "& .pages-right": {
        transition: "1s",
        transform: "rotateX(-70deg) rotateY(10deg)",
      },
    },
  },

  "&:not(.active)": {
    "& .hat": {
      "& .image-wrapper": {
        transition: "1s",
        top: "100px",
      },
      "& .hide-rat-transition": {
        transition: "1s",
        transform: "scaleY(5)",
      },
    },
    // BOOK
    "& .book": {
      transition: "1s",
      perspective: "800px",
      scale: "2.5",
      right: "37px",
      bottom: "0px",
      "& .pages-left": {
        transition: "1s",
        transform: "rotateX(0deg) rotateY(-90deg) translateZ(-13px)",
        "& .page, & .cover": {
          transitionDelay: "1s",
          opacity: 0,
        },
      },
      "& .pages-right": {
        transition: "1s",
        transform: "rotateX(0deg) rotateY(0deg)",

        "& .page": {
          transitionDelay: "1s",
          opacity: 0,
        },
      },
    },
  },
}));

export const BookContainer = styled(Box)(() => ({
  perspective: "800px",
  position: "absolute",
  width: "36px",
  display: "flex",
  bottom: 0,
}));

export const Pages = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
}));

export const HatWrapper = styled(Box)(() => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  overflow: "hidden",
}));
export const HideHat = styled(Box)(() => ({
  width: "100%",
  height: "17px",
  background: "#212331",
  position: "absolute",
  bottom: 0,
}));
export const CoverLeft = styled(Box)(() => ({
  width: pageWidth,
  height: pageHeight,
  background: "#CCC",
  borderRadius: "2px",
  transform: `translateZ(${pageDepth / 2}px)`,
}));
export const Page = styled(Box)(() => ({
  width: pageWidth,
  height: pageDepth,
  transform: `rotateX(90deg) translateZ(${pageHeight + pageDepth / 2}px)`,
}));
export const PageLeftImg = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  overflow: "hidden",
  backgroundImage: "url(/icons/pages.svg)",
  backgroundSize: "contain",
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
}));
export const CoverRight = styled(Box)(() => ({
  width: pageWidth,
  height: pageHeight,
  background: "#CCC",
  borderRadius: "2px",
  transform: `translateZ(${pageDepth / 2}px)`,
  backgroundImage: "url(/icons/book-cover-front.png)",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
}));

export const PageRightImg = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  overflow: "hidden",
  backgroundImage: "url(/icons/pages.svg)",
  backgroundSize: "contain",
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  transform: "scaleX(-1)",
}));
