import { useEffect, useState } from "react"
import { useLocation } from "react-router";


export const useSelectTab = <T>(tabType: string,defaultTab: T) =>{
    const [activeTab, setActiveTab] = useState(defaultTab);

    const {search} = useLocation()
    const params = new URLSearchParams(search)
    const tab = (params.get(tabType) as unknown) as T

    useEffect(() => {
        if(tab) setActiveTab(tab)
        else setActiveTab(defaultTab)
    }, [tab, defaultTab])

    return {activeTab}
}