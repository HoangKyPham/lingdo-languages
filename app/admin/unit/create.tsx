import { Create, NumberInput, ReferenceField, ReferenceInput, SimpleForm, TextInput, required } from "react-admin"


export const UnitCreate = () => {
    return (
        <Create>
            <SimpleForm  >
                <TextInput  source="title" validate={[required()]} label="Title" />
                <TextInput source="description" validate={[required()]} label="Description" />
                <ReferenceInput source="activeCourse" reference="courses" />
                <NumberInput min={1} source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Create>
    )
}