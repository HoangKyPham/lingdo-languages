import { Create, Edit, NumberInput, ReferenceField, ReferenceInput, SimpleForm, TextInput, required } from "react-admin"


export const UnitEdit = () => {
    return (
        <Edit>
            <SimpleForm  >
                <TextInput  source="title" validate={[required()]} label="Title" />
                <TextInput source="description" validate={[required()]} label="Description" />
                <ReferenceInput source="activeCourse" reference="courses" />
                <NumberInput min={1} source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Edit>
    )
}