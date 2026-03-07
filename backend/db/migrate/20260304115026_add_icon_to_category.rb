class AddIconToCategory < ActiveRecord::Migration[7.2]
  def change
    add_column :categories, :icon, :string
  end
end
