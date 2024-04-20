import { useEffect } from 'react';

import { usePagination } from '@ajna/pagination';
import { Box, ChakraProvider, Flex, Stack } from '@chakra-ui/react';

import { PaginationBottom } from './paginationBottom';

interface ItemPageProps {
  pageItems: any;
  CustomPage: any;
  filterKeyword: string;
}

function ItemPage({
  pageItems,
  CustomPage,
  filterKeyword,
}: ItemPageProps): JSX.Element {
  const getItems = () => {
    let filterKeywords = filterKeyword.split(' ');
    if (pageItems === undefined || !Array.isArray(pageItems)) return [];
    if (!filterKeywords) return pageItems;

    return pageItems
      .filter((item: string) =>
        filterKeywords.every((keyword: string) =>
          item.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .sort((a: string, b: string) => a.length - b.length);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterKeyword]);

  // states
  const {
    pages,
    pagesCount,
    offset,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = usePagination({
    total: getItems().length,
    limits: {
      outer: 2,
      inner: 2,
    },
    initialState: {
      pageSize: 10,
      isDisabled: false,
      currentPage: 1,
    },
  });

  return (
    <Flex className="flex-col flex-1">
      <ChakraProvider>
        <Box borderWidth="1px" borderRadius="lg" p="2">
          <Stack>
            {getItems()
              .slice(offset, offset + pageSize)
              .map((item: any, index: number) => (
                <CustomPage
                  key={index + '_' + currentPage}
                  pageItem={{ item }}></CustomPage>
              ))}
            {pagesCount > 1 && (
              <PaginationBottom
                pages={pages}
                pagesCount={pagesCount}
                currentPage={currentPage}
                onPageChanged={setCurrentPage}
              />
            )}
          </Stack>
        </Box>
      </ChakraProvider>
    </Flex>
  );
}

export default ItemPage;
