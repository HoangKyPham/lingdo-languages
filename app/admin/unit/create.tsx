import { Create, NumberInput, ReferenceField, SimpleForm, TextInput, required } from "react-admin"


export const UnitCreate = () => {
    return (
        <Create>
            <SimpleForm  >
                <TextInput  source="title" validate={[required()]} label="Title" />
                <TextInput source="description" validate={[required()]} label="Description" />
                <ReferenceField source="courseId" reference="courses" />
                <NumberInput source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Create>
    )
}