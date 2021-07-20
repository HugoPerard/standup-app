import React, { useContext } from 'react';

type LayoutContextValue = {
  isFocusMode: boolean;
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  navIsOpen: boolean;
  navOnOpen: () => void;
  navOnClose: () => void;
  hasSideBar: boolean;
  setHasSideBar(value: boolean): void;
};

export const LayoutContext = React.createContext<LayoutContextValue>(null);

export const useLayoutContext = () => useContext(LayoutContext);
