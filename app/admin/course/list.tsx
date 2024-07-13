import { dataProvider } from "@/app/admin/provider";
import { useEffect, useState } from "react";
import { Datagrid, Error, List, Loading, TextField, useDataProvider } from "react-admin"


export const CourseList = () => {

  
    return (
        <List>
            <Datagrid rowClick="edit" >
                <TextField source="id" />
                <TextField  source="title" />
                <TextField source="imageSrc" />
            </Datagrid>
        </List>
    )
}