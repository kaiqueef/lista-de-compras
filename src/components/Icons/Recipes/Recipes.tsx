import Image from "next/image";
import getShoppingContext from "@/context/getShoppingContext";
import { Box } from "@mui/material";
import {
  BookContainer,
  CoverLeft,
  CoverRight,
  HatWrapper,
  HideHat,
  Page,
  PageLeftImg,
  PageRightImg,
  Pages,
  RecipesWrapper,
} from "./styles";

export function Recipes() {
  const { page } = getShoppingContext();
  const active = page.current === "recipes";

  return (
    <RecipesWrapper className={active ? "active" : ""}>
      <HatWrapper className="hat">
        <Box className="image-wrapper" position="absolute">
          <Image
            quality={100}
            src="/icons/hat.png"
            width={149 / 3}
            height={137 / 3}
            alt="icon"
            priority={true}
          />
        </Box>
        <HideHat className="hide-rat-transition" />
      </HatWrapper>
      <BookContainer className="book">
        <Pages className="pages-left">
          <CoverLeft className="cover" />
          <Page className="page">
            <PageLeftImg className="img" />
          </Page>
        </Pages>
        <Pages className="pages-right">
          <CoverRight />
          <Page className="page">
            <PageRightImg />
          </Page>
        </Pages>
        <Box className="right"></Box>
      </BookContainer>
    </RecipesWrapper>
  );
}
