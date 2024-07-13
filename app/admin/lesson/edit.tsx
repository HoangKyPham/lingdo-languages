import { Create, Edit, NumberInput, ReferenceField, ReferenceInput, SimpleForm, TextInput, required } from "react-admin"


export const LessonEdit = () => {
    return (
        <Edit>
            <SimpleForm  >
                <TextInput  source="title" validate={[required()]} label="Title" />
                <ReferenceInput source="activeUnit" reference="units" />
                <NumberInput min={1} source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Edit>
    )
}