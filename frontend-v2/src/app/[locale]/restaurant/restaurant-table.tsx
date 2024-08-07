"use client";

import Card from "@/components/card";
import Pager from "@/components/pager";
import SearchBar from "@/components/search-bar";
import RestaurantUsecase from "@/module/restaurant/application/restaurantUsecase";
import RestaurantEntity from "@/module/restaurant/domain/restaurantEntity";
import RestaurantRepoImpl from "@/module/restaurant/presenter/restaurantRepoImpl";
import RestaurantViewModel from "@/module/restaurant/presenter/restaurantViewModel";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  locale: string;
  isEnableSearch?: boolean;
  isEnablePager?: boolean;
  isAdmin?: boolean;
  actions?: Readonly<React.ReactNode>;
};

export default function RestaurantTable({
  locale,
  isEnableSearch = false,
  isEnablePager = false,
  isAdmin = false,
  actions = [],
}: Props) {
  const trans = useTranslations("Restaurant");
  const statusTrans = useTranslations("Status");

  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  function handleSearchSubmit(text: string) {
    setCurrentPage(1);
    setSearchText(text);
  }

  return (
    <div>
      {isEnableSearch && <SearchBar className="mt-6" onSubmit={handleSearchSubmit} />}
      <div className="mt-4 border shadow-md rounded-xl overflow-hidden">
        <Card className="w-full rounded-b-xl overflow-hidden" isRounded={false} isBorder={false}>
          <Table></Table>
        </Card>
      </div>
      <div className="flex flex-row justify-between items-start md:items-center mt-4">
        <div>{actions ?? (<></>)}</div>
        {
          isEnablePager &&
          <div className="flex flex-row justify-end">
            <Pager totalPage={totalPage} onChange={setCurrentPage} />
          </div>
        }
      </div>
    </div>
  );

  function Table() {
    const [restaurants, setRestaurants] = useState<RestaurantEntity[]>([]);

    const restaurantUsecase = new RestaurantUsecase(new RestaurantRepoImpl());

    useEffect(() => {
      restaurantUsecase.getAllRestaurants({
        page: currentPage,
        visibility: !isAdmin,
        search: searchText,
      })
        .then(([restaurants, pager]) => {
          setRestaurants(restaurants);
          setTotalPage(pager.totalPage);
        })
        .catch((err) => console.error("Fetching restaurants failed:", err))
    }, [searchText, currentPage]);

    return restaurants.length === 0
      ? (
        <p className="py-12 text-center">
          {trans("not_found")}
        </p>
      )
      : (
        <div>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="px-3 md:px-6 py-3 md:ps-10 ps-5 text-nowrap w-full">{trans("table_title")}</th>
                <th className="px-3 md:px-6 py-3 max-md:pe-5 text-nowrap">{trans("table_category")}</th>
                <th className="px-3 md:px-6 py-3 max-md:pe-5 text-nowrap">{trans("table_item")}</th>
                <th className="px-3 md:px-6 py-3 max-md:pe-5 text-nowrap">{trans("table_valid")}</th>
                <th className="px-3 md:px-6 py-3 md:pe-10 max-md:hidden text-nowrap">{trans("table_time")}</th>
              </tr>
            </thead>
            <tbody>
              {
                restaurants.map((entity) => {
                  const viewModel = new RestaurantViewModel(entity);
                  return (
                    <tr key={viewModel.id} className="border-t">
                      <td className="px-3 md:px-6 py-3 md:ps-10 ps-5 text-nowrap"><Link href={`/restaurant/${viewModel.id}`} className="link">{trans(viewModel.title)}</Link></td>
                      <td className="px-3 md:px-6 py-3 max-md:pe-5 text-nowrap">{viewModel.title}</td>
                      <td className="px-3 md:px-6 py-3 max-md:pe-5 text-nowrap">{viewModel.item}</td>
                      <td className="px-3 md:px-6 py-3 max-md:pe-5 text-nowrap">{viewModel.valid}</td>
                      <td className="px-3 md:px-6 py-3 md:pe-10 max-md:hidden text-nowrap">{viewModel.inspectedDate}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      );
  }
}
