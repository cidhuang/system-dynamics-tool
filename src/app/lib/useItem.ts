import { useState } from "react";
import {
  Variable,
  Link,
  Stock,
  Flow,
  IItems,
} from "@/components/SystemMapCanvas/lib/types";

export function useItem(): [IItems, (items: IItems) => void] {
  const [items, setItems] = useState<IItems>({
    variables: new Array<Variable>(),
    links: new Array<Link>(),
    stocks: new Array<Stock>(),
    flows: new Array<Flow>(),
  });
  function handleItemsChange(items: IItems): void {
    setItems(items);
  }
  /*
  const [variables, setVariables] = useState<Variable[]>(new Array<Variable>());
  function handleVariablesChange(variables: Variable[]): void {
    setVariables(variables);
  }

  const [links, setLinks] = useState<Link[]>(new Array<Link>());
  function handleLinksChange(links: Link[]): void {
    setLinks(links);
  }

  const [stocks, setStocks] = useState<Stock[]>(new Array<Stock>());
  function handleStocksChange(stocks: Stock[]): void {
    setStocks(stocks);
  }

  const [flows, setFlows] = useState<Flow[]>(new Array<Flow>());
  function handleFlowsChange(flows: Flow[]): void {
    setFlows(flows);
  }
  */
  return [
    /*
    variables,
    links,
    stocks,
    flows,
    handleVariablesChange,
    handleLinksChange,
    handleStocksChange,
    handleFlowsChange,
    */
    items,
    handleItemsChange,
  ];
}
