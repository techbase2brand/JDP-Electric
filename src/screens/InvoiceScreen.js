
// import React, { useState, useEffect } from 'react';

// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   StatusBar,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
//   FlatList,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';


// // JDP Electrics Colors
// const COLORS = {
//   primary: '#3B82F6',
//   primaryDark: '#1E40AF',
//   primaryLight: '#93C5FD',
//   success: '#10B981',
//   warning: '#F59E0B',
//   danger: '#EF4444',
//   white: '#FFFFFF',
//   gray50: '#F9FAFB',
//   gray100: '#F3F4F6',
//   gray200: '#E5E7EB',
//   gray300: '#D1D5DB',
//   gray400: '#9CA3AF',
//   gray500: '#6B7280',
//   gray600: '#4B5563',
//   gray700: '#374151',
//   gray800: '#1F2937',
//   gray900: '#111827',
//   blue50: '#EFF6FF',
//   blue100: '#DBEAFE',
//   green50: '#ECFDF5',
//   green100: '#D1FAE5',
// };

// const InvoiceScreen = ({
//   user,
//   selectedJob,
//   onNavigate,
//   navigation
// }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [activeTab, setActiveTab] = useState('labor');
//   const [loading, setLoading] = useState(false);

//   // Available workers data
//   const availableWorkers = [
//     {
//       id: '1',
//       name: 'Sarah Johnson',
//       role: 'Lead Electrician',
//       hourlyRate: 85.0,
//     },
//     {
//       id: '2',
//       name: 'Mike Wilson',
//       role: 'Electrician',
//       hourlyRate: 65.0,
//     },
//     {
//       id: '3',
//       name: 'John Martinez',
//       role: 'Apprentice',
//       hourlyRate: 45.0,
//     },
//     {
//       id: '4',
//       name: 'Lisa Chen',
//       role: 'Senior Electrician',
//       hourlyRate: 75.0,
//     },
//   ];

//   // Helper functions
//   const ensureNumber = (value) => {
//     if (typeof value === 'number' && !isNaN(value)) {
//       return value;
//     }
//     const parsed = parseFloat(value);
//     return isNaN(parsed) ? 0 : parsed;
//   };

//   const calculateSubtotal = (
//     laborItems ,
//     materialItems 
//   ) => {
//     const laborTotal = laborItems.reduce(
//       (sum, item) => sum + ensureNumber(item.amount),
//       0
//     );
//     const materialTotal = materialItems.reduce(
//       (sum, item) => sum + ensureNumber(item.amount),
//       0
//     );
//     return laborTotal + materialTotal;
//   };

//   // Initialize invoice state
//   const [invoice, setInvoice] = useState(() => {
//     const initialLaborItems = [
//       {
//         id: '1',
//         type: 'labor',
//         qty: 2.5,
//         item: 'Electrical Installation Work',
//         description: 'Panel installation and wiring connections',
//         rate: 85.0,
//         amount: 212.5,
//         laborName: 'Sarah Johnson',
//         laborId: '1',
//       },
//     ];

//     const initialMaterialItems = [];
//     const initialSubtotal = calculateSubtotal(
//       initialLaborItems,
//       initialMaterialItems
//     );
//     const initialPaymentsCredits = -150.0;
//     const initialBalanceDue = initialSubtotal + initialPaymentsCredits;

//     return {
//       id: 'INV-001',
//       invoiceNumber: '1116/2024',
//       date: new Date().toISOString().split('T')[0],
//       dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
//         .toISOString()
//         .split('T')[0],
//       poNumber: 'NOM',
//       status: 'draft',
//       billTo: {
//         name: selectedJob?.customer?.name || 'Fred Olsvold',
//         address: selectedJob?.location?.address || '20335 Manor Rd',
//         city: 'Deephaven',
//         state: 'MN',
//         zip: '55391',
//       },
//       project: selectedJob?.title || '20335 Manor Rd Project',
//       laborItems: initialLaborItems,
//       materialItems: initialMaterialItems,
//       subtotal: initialSubtotal,
//       paymentsCredits: initialPaymentsCredits,
//       balanceDue: initialBalanceDue,
//       notes: 'Thank you for your business.',
//     };
//   });

//   // Update invoice field
//   const updateInvoiceField = (field, value) => {
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       setInvoice((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }));
//     } else {
//       setInvoice((prev) => {
//         const updatedInvoice = { ...prev, [field]: value };

//         if (field === 'paymentsCredits') {
//           const paymentsCredits = ensureNumber(value);
//           updatedInvoice.paymentsCredits = paymentsCredits;
//           updatedInvoice.balanceDue =
//             ensureNumber(updatedInvoice.subtotal) + paymentsCredits;
//         }

//         return updatedInvoice;
//       });
//     }
//   };

//   // Update invoice item
//   const updateInvoiceItem = (
//     itemId,
//     field,
//     value ,
//     itemType
//   ) => {
//     setInvoice((prev) => {
//       const itemsKey = itemType === 'labor' ? 'laborItems' : 'materialItems';
//       const updatedItems = prev[itemsKey].map((item) => {
//         if (item.id === itemId) {
//           const updatedItem = { ...item, [field]: value };

//           if (field === 'laborId' && itemType === 'labor') {
//             const worker = availableWorkers.find((w) => w.id === value);
//             if (worker) {
//               updatedItem.laborName = worker.name;
//               updatedItem.rate = worker.hourlyRate;
//               updatedItem.amount =
//                 ensureNumber(updatedItem.qty) * worker.hourlyRate;
//             }
//           } else if (field === 'qty' || field === 'rate') {
//             const qty =
//               field === 'qty'
//                 ? ensureNumber(value)
//                 : ensureNumber(updatedItem.qty);
//             const rate =
//               field === 'rate'
//                 ? ensureNumber(value)
//                 : ensureNumber(updatedItem.rate);
//             updatedItem.qty = qty;
//             updatedItem.rate = rate;
//             updatedItem.amount = qty * rate;
//           }

//           return updatedItem;
//         }
//         return item;
//       });

//       const newSubtotal = calculateSubtotal(
//         itemType === 'labor' ? updatedItems : prev.laborItems,
//         itemType === 'material' ? updatedItems : prev.materialItems
//       );

//       return {
//         ...prev,
//         [itemsKey]: updatedItems,
//         subtotal: newSubtotal,
//         balanceDue: newSubtotal + ensureNumber(prev.paymentsCredits),
//       };
//     });
//   };

//   // Add new item
//   const addNewItem = (type) => {
//     const newItem = {
//       id: `${type}-${Date.now()}`,
//       type,
//       qty: 1,
//       item: type === 'labor' ? 'Labor Work' : 'Material',
//       description: '',
//       rate: type === 'labor' ? 65.0 : 0,
//       amount: type === 'labor' ? 65.0 : 0,
//       laborName: type === 'labor' ? availableWorkers[1].name : undefined,
//       laborId: type === 'labor' ? availableWorkers[1].id : undefined,
//     };

//     setInvoice((prev) => {
//       const itemsKey = type === 'labor' ? 'laborItems' : 'materialItems';
//       const updatedItems = [...prev[itemsKey], newItem];
//       const newSubtotal = calculateSubtotal(
//         type === 'labor' ? updatedItems : prev.laborItems,
//         type === 'material' ? updatedItems : prev.materialItems
//       );

//       return {
//         ...prev,
//         [itemsKey]: updatedItems,
//         subtotal: newSubtotal,
//         balanceDue: newSubtotal + ensureNumber(prev.paymentsCredits),
//       };
//     });
//   };

//   // Remove item
//   const removeItem = (itemId, itemType) => {
//     setInvoice((prev) => {
//       const itemsKey = itemType === 'labor' ? 'laborItems' : 'materialItems';
//       const updatedItems = prev[itemsKey].filter((item) => item.id !== itemId);
//       const newSubtotal = calculateSubtotal(
//         itemType === 'labor' ? updatedItems : prev.laborItems,
//         itemType === 'material' ? updatedItems : prev.materialItems
//       );

//       return {
//         ...prev,
//         [itemsKey]: updatedItems,
//         subtotal: newSubtotal,
//         balanceDue: newSubtotal + ensureNumber(prev.paymentsCredits),
//       };
//     });
//   };

//   // Navigation handlers
//   const proceedToPreview = () => {
//     if (
//       invoice.laborItems.length === 0 &&
//       invoice.materialItems.length === 0
//     ) {
//       Alert.alert(
//         'Missing Items',
//         'Please add at least one labor or material item to the invoice'
//       );
//       return;
//     }
//     if (!invoice.billTo.name.trim()) {
//       Alert.alert('Missing Information', 'Please enter customer information');
//       return;
//     }
//     setCurrentStep(2);
//   };

//   const goBackToEdit = () => {
//     setCurrentStep(1);
//   };

//   const handleSendInvoice = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setInvoice((prev) => ({ ...prev, status: 'sent' }));
//       Alert.alert('Success', 'Invoice sent to customer successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             setLoading(false);
//             navigation.navigate('HomeScreen');
//           },
//         },
//       ]);
//     }, 2000);
//   };

//   const handleDownloadInvoice = () => {
//     Alert.alert('Success', 'Invoice downloaded successfully!');
//   };
//  const [modalVisible, setModalVisible] = useState(false);

//   const handleSelectWorker = (workerId) => {
//     updateInvoiceItem(workerId, 'laborId', workerId, 'labor');
//     setModalVisible(false);
//   };

//   const renderWorkerItem = ({ item: worker }) => (
//     <TouchableOpacity
//       key={worker.id}
//       style={[
//         styles.workerCard,
//         worker.laborId === worker.id && styles.workerCardSelected,
//       ]}
//       onPress={() => handleSelectWorker(worker.id)}
//     >
//       <Text style={styles.workerName}>{worker.name}</Text>
//       <Text style={styles.workerRole}>{worker.role}</Text>
//       <Text style={styles.workerRate}>${worker.hourlyRate.toFixed(2)}/hr</Text>
//     </TouchableOpacity>
//   );

//   // Render worker picker
//   const renderWorkerPicker = (item, itemIndex) => (
//      <View>
//       {/* Button to open modal */}
//       <TouchableOpacity
//         style={styles.openButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.openButtonText}>
//           {item.laborId
//             ? availableWorkers.find(w => w.id === item.laborId)?.name || 'Select Worker'
//             : 'Select Worker'}
//         </Text>
//       </TouchableOpacity>

//       {/* Modal */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Select Worker</Text>
//             <FlatList
//               data={availableWorkers}
//               keyExtractor={(worker) => worker.id.toString()}
//               renderItem={renderWorkerItem}
//               ItemSeparatorComponent={() => <View style={styles.separator} />}
//             />
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//     // <View style={styles.workerPickerContainer}>
//     //   <Text style={styles.inputLabel}>Select Worker</Text>
//     //   <View style={styles.workerGrid}>
//     //     {availableWorkers.map((worker) => (
//     //       <TouchableOpacity
//     //         key={worker.id}
//     //         style={[
//     //           styles.workerCard,
//     //           item.laborId === worker.id && styles.workerCardSelected,
//     //         ]}
//     //         onPress={() =>
//     //           updateInvoiceItem(item.id, 'laborId', worker.id, 'labor')
//     //         }
//     //       >
//     //         <View style={styles.workerAvatar}>
//     //           <Text style={styles.workerAvatarText}>
//     //             {worker.name.charAt(0)}
//     //           </Text>
//     //         </View>
//     //         <View style={styles.workerInfo}>
//     //           <Text style={styles.workerName}>{worker.name}</Text>
//     //           <Text style={styles.workerRole}>{worker.role}</Text>
//     //           <Text style={styles.workerRate}>
//     //             ${worker.hourlyRate.toFixed(2)}/hr
//     //           </Text>
//     //         </View>
//     //       </TouchableOpacity>
//     //     ))}
//     //   </View>
//     // </View>
//   );

//   // Render labor item form
//   const renderLaborItemForm = (items) => (
//     <View style={styles.itemsContainer}>
//       {items.map((item, index) => (
//         <View key={item.id} style={styles.laborItemCard}>
//           <View style={styles.itemHeader}>
//             <View style={styles.itemHeaderLeft}>
//               <Ionicons name="time" size={16} color={COLORS.primary} />
//               <Text style={styles.itemHeaderTitle}>
//                 Labor Entry {index + 1}
//               </Text>
//             </View>
//             {items.length > 1 && (
//               <TouchableOpacity
//                 style={styles.removeButton}
//                 onPress={() => removeItem(item.id, 'labor')}
//               >
//                 <Ionicons name="remove-circle" size={20} color={COLORS.danger} />
//               </TouchableOpacity>
//             )}
//           </View>

//           {renderWorkerPicker(item, index)}

//           <View style={styles.inputRow}>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>Hours Worked</Text>
//               <TextInput
//                 style={styles.input}
//                 value={item.qty.toString()}
//                 onChangeText={(text) =>
//                   updateInvoiceItem(
//                     item.id,
//                     'qty',
//                     parseFloat(text) || 0,
//                     'labor'
//                   )
//                 }
//                 keyboardType="numeric"
//                 placeholder="0.00"
//               />
//             </View>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>Rate/Hour ($)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={item.rate.toString()}
//                 onChangeText={(text) =>
//                   updateInvoiceItem(
//                     item.id,
//                     'rate',
//                     parseFloat(text) || 0,
//                     'labor'
//                   )
//                 }
//                 keyboardType="numeric"
//                 placeholder="0.00"
//               />
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Service Description</Text>
//             <TextInput
//               style={styles.input}
//               value={item.item}
//               onChangeText={(text) =>
//                 updateInvoiceItem(item.id, 'item', text, 'labor')
//               }
//               placeholder="Service performed"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Work Details</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               value={item.description}
//               onChangeText={(text) =>
//                 updateInvoiceItem(item.id, 'description', text, 'labor')
//               }
//               placeholder="Detailed work description"
//               multiline
//               numberOfLines={3}
//             />
//           </View>

//           <View style={styles.laborSummary}>
//             <View style={styles.laborSummaryRow}>
//               <Text style={styles.laborSummaryLabel}>
//                 Worker: {item.laborName || 'Not selected'}
//               </Text>
//               <Text style={styles.laborSummaryAmount}>
//                 Amount: ${ensureNumber(item.amount).toFixed(2)}
//               </Text>
//             </View>
//           </View>
//         </View>
//       ))}

//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => addNewItem('labor')}
//       >
//         <Ionicons name="add-circle" size={20} color={COLORS.primary} />
//         <Text style={styles.addButtonText}>Add Labor Entry</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // Render material item form
//   const renderMaterialItemForm = (items) => (
//     <View style={styles.itemsContainer}>
//       {items.map((item, index) => (
//         <View key={item.id} style={styles.materialItemCard}>
//           <View style={styles.itemHeader}>
//             <View style={styles.itemHeaderLeft}>
//               <Ionicons name="cube" size={16} color={COLORS.success} />
//               <Text style={styles.itemHeaderTitle}>
//                 Material {index + 1}
//               </Text>
//             </View>
//             {items.length > 1 && (
//               <TouchableOpacity
//                 style={styles.removeButton}
//                 onPress={() => removeItem(item.id, 'material')}
//               >
//                 <Ionicons name="remove-circle" size={20} color={COLORS.danger} />
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.inputRow}>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>Quantity</Text>
//               <TextInput
//                 style={styles.input}
//                 value={item.qty.toString()}
//                 onChangeText={(text) =>
//                   updateInvoiceItem(
//                     item.id,
//                     'qty',
//                     parseFloat(text) || 0,
//                     'material'
//                   )
//                 }
//                 keyboardType="numeric"
//                 placeholder="1"
//               />
//             </View>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>Rate/Unit ($)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={item.rate.toString()}
//                 onChangeText={(text) =>
//                   updateInvoiceItem(
//                     item.id,
//                     'rate',
//                     parseFloat(text) || 0,
//                     'material'
//                   )
//                 }
//                 keyboardType="numeric"
//                 placeholder="0.00"
//               />
//             </View>
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Item Name</Text>
//             <TextInput
//               style={styles.input}
//               value={item.item}
//               onChangeText={(text) =>
//                 updateInvoiceItem(item.id, 'item', text, 'material')
//               }
//               placeholder="Material name"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Description</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               value={item.description}
//               onChangeText={(text) =>
//                 updateInvoiceItem(item.id, 'description', text, 'material')
//               }
//               placeholder="Material specifications"
//               multiline
//               numberOfLines={3}
//             />
//           </View>

//           <View style={styles.materialSummary}>
//             <Text style={styles.materialSummaryAmount}>
//               Amount: ${ensureNumber(item.amount).toFixed(2)}
//             </Text>
//           </View>
//         </View>
//       ))}

//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => addNewItem('material')}
//       >
//         <Ionicons name="add-circle" size={20} color={COLORS.success} />
//         <Text style={styles.addButtonText}>Add Material Item</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // Render data entry step
//   const renderDataEntry = () => (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Invoice Information */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Ionicons name="document-text" size={20} color={COLORS.primary} />
//           <Text style={styles.sectionTitle}>Invoice Information</Text>
//         </View>
//         <View style={styles.card}>
//           <View style={styles.inputRow}>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>Invoice Number</Text>
//               <TextInput
//                 style={styles.input}
//                 value={invoice.invoiceNumber}
//                 onChangeText={(text) =>
//                   updateInvoiceField('invoiceNumber', text)
//                 }
//                 placeholder="Invoice #"
//               />
//             </View>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>Date</Text>
//               <TextInput
//                 style={styles.input}
//                 value={invoice.date}
//                 onChangeText={(text) => updateInvoiceField('date', text)}
//                 placeholder="YYYY-MM-DD"
//               />
//             </View>
//           </View>
//           <View style={styles.inputRow}>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>Due Date</Text>
//               <TextInput
//                 style={styles.input}
//                 value={invoice.dueDate}
//                 onChangeText={(text) => updateInvoiceField('dueDate', text)}
//                 placeholder="YYYY-MM-DD"
//               />
//             </View>
//             <View style={styles.inputHalf}>
//               <Text style={styles.inputLabel}>P.O. Number</Text>
//               <TextInput
//                 style={styles.input}
//                 value={invoice.poNumber}
//                 onChangeText={(text) => updateInvoiceField('poNumber', text)}
//                 placeholder="P.O. Number"
//               />
//             </View>
//           </View>
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Project</Text>
//             <TextInput
//               style={styles.input}
//               value={invoice.project}
//               onChangeText={(text) => updateInvoiceField('project', text)}
//               placeholder="Project description"
//             />
//           </View>
//         </View>
//       </View>

//       {/* Customer Information */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Ionicons name="person" size={20} color={COLORS.primary} />
//           <Text style={styles.sectionTitle}>Bill To</Text>
//         </View>
//         <View style={styles.card}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Customer Name</Text>
//             <TextInput
//               style={styles.input}
//               value={invoice.billTo.name}
//               onChangeText={(text) => updateInvoiceField('billTo.name', text)}
//               placeholder="Customer name"
//             />
//           </View>
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Address</Text>
//             <TextInput
//               style={styles.input}
//               value={invoice.billTo.address}
//               onChangeText={(text) =>
//                 updateInvoiceField('billTo.address', text)
//               }
//               placeholder="Street address"
//             />
//           </View>
//           <View style={styles.inputRow}>
//             <View style={styles.inputThird}>
//               <Text style={styles.inputLabel}>City</Text>
//               <TextInput
//                 style={styles.input}
//                 value={invoice.billTo.city}
//                 onChangeText={(text) => updateInvoiceField('billTo.city', text)}
//                 placeholder="City"
//               />
//             </View>
//             <View style={styles.inputThird}>
//               <Text style={styles.inputLabel}>State</Text>
//               <TextInput
//                 style={styles.input}
//                 value={invoice.billTo.state}
//                 onChangeText={(text) =>
//                   updateInvoiceField('billTo.state', text)
//                 }
//                 placeholder="State"
//               />
//             </View>
//             <View style={styles.inputThird}>
//               <Text style={styles.inputLabel}>ZIP</Text>
//               <TextInput
//                 style={styles.input}
//                 value={invoice.billTo.zip}
//                 onChangeText={(text) => updateInvoiceField('billTo.zip', text)}
//                 placeholder="ZIP"
//               />
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* Labor & Materials */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Ionicons name="construct" size={20} color={COLORS.primary} />
//           <Text style={styles.sectionTitle}>Labor & Materials</Text>
//         </View>

//         {/* Tab Navigation */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[
//               styles.tab,
//               activeTab === 'labor' && styles.tabActive,
//             ]}
//             onPress={() => setActiveTab('labor')}
//           >
//             <Ionicons
//               name="time"
//               size={16}
//               color={activeTab === 'labor' ? COLORS.white : COLORS.gray600}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === 'labor' && styles.tabTextActive,
//               ]}
//             >
//               Labor ({invoice.laborItems.length})
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.tab,
//               activeTab === 'material' && styles.tabActive,
//             ]}
//             onPress={() => setActiveTab('material')}
//           >
//             <Ionicons
//               name="cube"
//               size={16}
//               color={activeTab === 'material' ? COLORS.white : COLORS.gray600}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === 'material' && styles.tabTextActive,
//               ]}
//             >
//               Materials ({invoice.materialItems.length})
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Tab Content */}
//         {activeTab === 'labor'
//           ? renderLaborItemForm(invoice.laborItems)
//           : renderMaterialItemForm(invoice.materialItems)}
//       </View>

//       {/* Payment Information */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Ionicons name="card" size={20} color={COLORS.primary} />
//           <Text style={styles.sectionTitle}>Payment Information</Text>
//         </View>
//         <View style={styles.card}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Payments/Credits</Text>
//             <TextInput
//               style={styles.input}
//               value={invoice.paymentsCredits.toString()}
//               onChangeText={(text) =>
//                 updateInvoiceField('paymentsCredits', parseFloat(text) || 0)
//               }
//               keyboardType="numeric"
//               placeholder="0.00"
//             />
//           </View>
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Notes</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               value={invoice.notes}
//               onChangeText={(text) => updateInvoiceField('notes', text)}
//               placeholder="Additional notes or terms"
//               multiline
//               numberOfLines={3}
//             />
//           </View>
//         </View>
//       </View>

//       {/* Summary */}
//       <View style={styles.section}>
//         <View style={styles.summaryCard}>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Labor Total:</Text>
//             <Text style={styles.summaryValue}>
//               $
//               {invoice.laborItems
//                 .reduce((sum, item) => sum + ensureNumber(item.amount), 0)
//                 .toFixed(2)}
//             </Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Materials Total:</Text>
//             <Text style={styles.summaryValue}>
//               $
//               {invoice.materialItems
//                 .reduce((sum, item) => sum + ensureNumber(item.amount), 0)
//                 .toFixed(2)}
//             </Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Subtotal:</Text>
//             <Text style={styles.summaryValueBold}>
//               ${invoice.subtotal.toFixed(2)}
//             </Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Payments/Credits:</Text>
//             <Text style={styles.summaryValue}>
//               ${invoice.paymentsCredits.toFixed(2)}
//             </Text>
//           </View>
//           <View style={[styles.summaryRow, styles.summaryRowTotal]}>
//             <Text style={styles.summaryLabelTotal}>Balance Due:</Text>
//             <Text style={styles.summaryValueTotal}>
//               ${invoice.balanceDue.toFixed(2)}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );

//   // Render preview step
//   const renderPreview = () => (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.previewCard}>
//         <Text style={styles.previewTitle}>Invoice Preview</Text>

//         {/* Invoice Header */}
//         <View style={styles.previewHeader}>
//           <Text style={styles.companyName}>JDP Electrics</Text>
//           <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
//         </View>

//         {/* Bill To */}
//         <View style={styles.previewSection}>
//           <Text style={styles.previewSectionTitle}>Bill To:</Text>
//           <Text style={styles.previewText}>{invoice.billTo.name}</Text>
//           <Text style={styles.previewText}>{invoice.billTo.address}</Text>
//           <Text style={styles.previewText}>
//             {invoice.billTo.city}, {invoice.billTo.state} {invoice.billTo.zip}
//           </Text>
//         </View>

//         {/* Project & Dates */}
//         <View style={styles.previewSection}>
//           <View style={styles.previewRow}>
//             <View style={styles.previewColumn}>
//               <Text style={styles.previewLabel}>Project:</Text>
//               <Text style={styles.previewText}>{invoice.project}</Text>
//             </View>
//             <View style={styles.previewColumn}>
//               <Text style={styles.previewLabel}>Date:</Text>
//               <Text style={styles.previewText}>{invoice.date}</Text>
//             </View>
//           </View>
//           <View style={styles.previewRow}>
//             <View style={styles.previewColumn}>
//               <Text style={styles.previewLabel}>P.O. Number:</Text>
//               <Text style={styles.previewText}>{invoice.poNumber}</Text>
//             </View>
//             <View style={styles.previewColumn}>
//               <Text style={styles.previewLabel}>Due Date:</Text>
//               <Text style={styles.previewText}>{invoice.dueDate}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Items */}
//         {invoice.laborItems.length > 0 && (
//           <View style={styles.previewSection}>
//             <Text style={styles.previewSectionTitle}>Labor Items:</Text>
//             {invoice.laborItems.map((item, index) => (
//               <View key={item.id} style={styles.previewItem}>
//                 <Text style={styles.previewItemTitle}>{item.item}</Text>
//                 <Text style={styles.previewItemDescription}>
//                   {item.description}
//                 </Text>
//                 <View style={styles.previewItemDetails}>
//                   <Text style={styles.previewItemDetail}>
//                     {item.qty} hrs × ${item.rate.toFixed(2)}
//                   </Text>
//                   <Text style={styles.previewItemAmount}>
//                     ${item.amount.toFixed(2)}
//                   </Text>
//                 </View>
//                 <Text style={styles.previewItemWorker}>
//                   Worker: {item.laborName}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {invoice.materialItems.length > 0 && (
//           <View style={styles.previewSection}>
//             <Text style={styles.previewSectionTitle}>Material Items:</Text>
//             {invoice.materialItems.map((item, index) => (
//               <View key={item.id} style={styles.previewItem}>
//                 <Text style={styles.previewItemTitle}>{item.item}</Text>
//                 <Text style={styles.previewItemDescription}>
//                   {item.description}
//                 </Text>
//                 <View style={styles.previewItemDetails}>
//                   <Text style={styles.previewItemDetail}>
//                     {item.qty} × ${item.rate.toFixed(2)}
//                   </Text>
//                   <Text style={styles.previewItemAmount}>
//                     ${item.amount.toFixed(2)}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Totals */}
//         <View style={styles.previewTotals}>
//           <View style={styles.previewTotalRow}>
//             <Text style={styles.previewTotalLabel}>Subtotal:</Text>
//             <Text style={styles.previewTotalValue}>
//               ${invoice.subtotal.toFixed(2)}
//             </Text>
//           </View>
//           <View style={styles.previewTotalRow}>
//             <Text style={styles.previewTotalLabel}>Payments/Credits:</Text>
//             <Text style={styles.previewTotalValue}>
//               ${invoice.paymentsCredits.toFixed(2)}
//             </Text>
//           </View>
//           <View style={[styles.previewTotalRow, styles.previewTotalRowFinal]}>
//             <Text style={styles.previewTotalLabelFinal}>Balance Due:</Text>
//             <Text style={styles.previewTotalValueFinal}>
//               ${invoice.balanceDue.toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* Notes */}
//         {invoice.notes && (
//           <View style={styles.previewSection}>
//             <Text style={styles.previewSectionTitle}>Notes:</Text>
//             <Text style={styles.previewText}>{invoice.notes}</Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={
//             currentStep === 1 ? () => onNavigate('dashboard') : goBackToEdit
//           }
//         >
//           <Ionicons name="arrow-back" size={24} color={"#000"} />
//         </TouchableOpacity>

//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>
//             {currentStep === 1 ? 'Create Invoice' : 'Invoice Preview'}
//           </Text>
//           <Text style={styles.headerSubtitle}>
//             Step {currentStep} of 2{' '}
//             {currentStep === 1 ? '• Enter Details' : '• Review & Send'}
//           </Text>
//         </View>

//         <View style={styles.headerRight} />
//       </View>

//       <KeyboardAvoidingView
//         style={styles.flex1}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         {currentStep === 1 ? renderDataEntry() : renderPreview()}

//         {/* Bottom Action Bar */}
//         <View style={styles.bottomBar}>
//           {currentStep === 1 ? (
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={proceedToPreview}
//             >
//               <Text style={styles.primaryButtonText}>Continue to Preview</Text>
//               <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
//             </TouchableOpacity>
//           ) : (
//             <View style={styles.previewActions}>
//               <TouchableOpacity
//                 style={styles.secondaryButton}
//                 onPress={handleDownloadInvoice}
//               >
//                 <Ionicons name="download" size={18} color={COLORS.primary} />
//                 <Text style={styles.secondaryButtonText}>Download</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.primaryButton,
//                   styles.sendButton,
//                   loading && styles.disabledButton,
//                 ]}
//                 onPress={handleSendInvoice}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <Text style={styles.primaryButtonText}>Sending...</Text>
//                 ) : (
//                   <>
//                     <Text style={styles.primaryButtonText}>Send Invoice</Text>
//                     <Ionicons name="send" size={18} color={COLORS.white} />
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// // Styles
// const styles = {
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   flex1: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center' ,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.primary,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: 'center' ,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: "#000",
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: "#000",
//     marginTop: 2,
//   },
//   headerRight: {
//     width: 40,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.gray50,
//   },
//   section: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center' ,
//     paddingVertical: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.gray900,
//     marginLeft: 8,
//   },
//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: COLORS.gray900,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   inputHalf: {
//     flex: 1,
//   },
//   inputThird: {
//     flex: 1,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.gray700,
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.gray300,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: COLORS.gray900,
//     backgroundColor: COLORS.white,
//   },
//   textArea: {
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.gray100,
//     borderRadius: 8,
//     padding: 4,
//     marginHorizontal: 16,
//     marginBottom: 16,
//   },
//   tab: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center' ,
//     justifyContent: 'center' ,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//   },
//   tabActive: {
//     backgroundColor: COLORS.primary,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.gray600,
//     marginLeft: 6,
//   },
//   tabTextActive: {
//     color: COLORS.white,
//   },
//   itemsContainer: {
//     paddingHorizontal: 16,
//   },
//   laborItemCard: {
//     backgroundColor: COLORS.blue50,
//     borderWidth: 1,
//     borderColor: COLORS.blue100,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   materialItemCard: {
//     backgroundColor: COLORS.green50,
//     borderWidth: 1,
//     borderColor: COLORS.green100,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center' ,
//     marginBottom: 16,
//   },
//   itemHeaderLeft: {
//     flexDirection: 'row',
//     alignItems: 'center' ,
//   },
//   itemHeaderTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.gray900,
//     marginLeft: 8,
//   },
//   removeButton: {
//     padding: 4,
//   },
//   workerPickerContainer: {
//     marginBottom: 16,
//   },
//   workerGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginTop: 8,
//   },
//   workerCard: {
//     width: '48%',
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.gray200,
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center' ,
//   },
//   workerCardSelected: {
//     borderColor: COLORS.primary,
//     backgroundColor: COLORS.blue50,
//   },
//   workerAvatar: {
//     width: 32,
//     height: 32,
//     backgroundColor: COLORS.primary,
//     borderRadius: 16,
//     alignItems: 'center' ,
//     justifyContent: 'center' ,
//     marginBottom: 6,
//   },
//   workerAvatarText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   workerInfo: {
//     alignItems: 'center' ,
//   },
//   workerName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: COLORS.gray900,
//     textAlign: 'center' ,
//   },
//   workerRole: {
//     fontSize: 10,
//     color: COLORS.gray500,
//     textAlign: 'center' ,
//   },
//   workerRate: {
//     fontSize: 11,
//     color: COLORS.primary,
//     fontWeight: '500',
//     textAlign: 'center' ,
//   },
//   laborSummary: {
//     backgroundColor: COLORS.blue100,
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 8,
//   },
//   laborSummaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   laborSummaryLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.primary,
//   },
//   laborSummaryAmount: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.primary,
//   },
//   materialSummary: {
//     backgroundColor: COLORS.green100,
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 8,
//     alignItems: 'flex-end',
//   },
//   materialSummaryAmount: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.success,
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center' ,
//     justifyContent: 'center' ,
//     backgroundColor: COLORS.white,
//     borderWidth: 2,
//     borderColor: COLORS.gray200,
//     borderStyle: 'dashed' ,
//     borderRadius: 12,
//     paddingVertical: 16,
//     marginBottom: 16,
//   },
//   addButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.primary,
//     marginLeft: 8,
//   },
//   summaryCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     marginHorizontal: 16,
//     shadowColor: COLORS.gray900,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center' ,
//     paddingVertical: 6,
//   },
//   summaryRowTotal: {
//     borderTopWidth: 1,
//     borderTopColor: COLORS.gray200,
//     paddingTop: 12,
//     marginTop: 6,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: COLORS.gray600,
//   },
//   summaryValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.gray900,
//   },
//   summaryValueBold: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.gray900,
//   },
//   summaryLabelTotal: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.gray900,
//   },
//   summaryValueTotal: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   previewCard: {
//     backgroundColor: COLORS.white,
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: COLORS.gray900,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   previewTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.gray900,
//     textAlign: 'center' ,
//     marginBottom: 20,
//   },
//   previewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center' ,
//     marginBottom: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.gray200,
//   },
//   companyName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   invoiceNumber: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.gray600,
//   },
//   previewSection: {
//     marginBottom: 20,
//   },
//   previewSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.gray900,
//     marginBottom: 8,
//   },
//   previewRow: {
//     flexDirection: 'row',
//     gap: 20,
//     marginBottom: 8,
//   },
//   previewColumn: {
//     flex: 1,
//   },
//   previewLabel: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: COLORS.gray500,
//     marginBottom: 2,
//   },
//   previewText: {
//     fontSize: 14,
//     color: COLORS.gray800,
//     lineHeight: 20,
//   },
//   previewItem: {
//     backgroundColor: COLORS.gray50,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//   },
//   previewItemTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.gray900,
//     marginBottom: 4,
//   },
//   previewItemDescription: {
//     fontSize: 12,
//     color: COLORS.gray600,
//     marginBottom: 6,
//   },
//   previewItemDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center' ,
//   },
//   previewItemDetail: {
//     fontSize: 12,
//     color: COLORS.gray500,
//   },
//   previewItemAmount: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.gray900,
//   },
//   previewItemWorker: {
//     fontSize: 11,
//     color: COLORS.primary,
//     marginTop: 4,
//   },
//   previewTotals: {
//     backgroundColor: COLORS.gray50,
//     borderRadius: 8,
//     padding: 16,
//     marginTop: 16,
//   },
//   previewTotalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center' ,
//     paddingVertical: 4,
//   },
//   previewTotalRowFinal: {
//     borderTopWidth: 2,
//     borderTopColor: COLORS.primary,
//     paddingTop: 12,
//     marginTop: 8,
//   },
//   previewTotalLabel: {
//     fontSize: 14,
//     color: COLORS.gray600,
//   },
//   previewTotalValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: COLORS.gray900,
//   },
//   previewTotalLabelFinal: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.gray900,
//   },
//   previewTotalValueFinal: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   bottomBar: {
//     backgroundColor: COLORS.white,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.gray200,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   primaryButton: {
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     alignItems: 'center' ,
//     justifyContent: 'center' ,
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//   },
//   primaryButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.white,
//   },
//   previewActions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   secondaryButton: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     flexDirection: 'row' ,
//     alignItems: 'center' ,
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//   },
//   secondaryButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.primary,
//   },
//   sendButton: {
//     flex: 2,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },

//   openButton: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginVertical: 5,
//   },
//   openButtonText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 15,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   separator: {
//     height: 8,
//   },
//   closeButton: {
//     marginTop: 10,
//     backgroundColor: '#ff6666',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// };

// export default InvoiceScreen;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


// JDP Electrics Colors
const COLORS = {
  primary: '#3B82F6',
  primaryDark: '#1E40AF',
  primaryLight: '#93C5FD',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  green50: '#ECFDF5',
  green100: '#D1FAE5',
};

const WorkerDropdown = ({
  selectedWorkerId,
  workers,
  onSelect,
  placeholder = "Select Worker"
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

  const handleWorkerSelect = (workerId) => {
    onSelect(workerId);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.dropdownContent}>
          {selectedWorker ? (
            <View style={styles.selectedWorkerDisplay}>
              <View style={styles.workerAvatarSmall}>
                <Text style={styles.workerAvatarTextSmall}>
                  {selectedWorker.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.selectedWorkerInfo}>
                <Text style={styles.selectedWorkerName}>{selectedWorker.name}</Text>
                <Text style={styles.selectedWorkerDetails}>
                  {selectedWorker.role} • ${selectedWorker.hourlyRate.toFixed(2)}/hr
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.dropdownPlaceholder}>{placeholder}</Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color={COLORS.gray400} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Worker</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={COLORS.gray600} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={workers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.workerOption,
                    selectedWorkerId === item.id && styles.workerOptionSelected
                  ]}
                  onPress={() => handleWorkerSelect(item.id)}
                >
                  <View style={styles.workerOptionContent}>
                    <View style={styles.workerAvatar}>
                      <Text style={styles.workerAvatarText}>
                        {item.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.workerOptionInfo}>
                      <Text style={styles.workerOptionName}>{item.name}</Text>
                      <Text style={styles.workerOptionRole}>{item.role}</Text>
                      <Text style={styles.workerOptionRate}>
                        ${item.hourlyRate.toFixed(2)}/hour
                      </Text>
                    </View>
                  </View>
                  {selectedWorkerId === item.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const InvoiceManagementScreen = ({
  selectedJob,
  onNavigate,
  navigation
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('labor');
  const [loading, setLoading] = useState(false);

  // Available workers data
  const availableWorkers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Lead Electrician',
      hourlyRate: 85.0,
      avatar: 'SJ'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      role: 'Electrician',
      hourlyRate: 65.0,
      avatar: 'MW'
    },
    {
      id: '3',
      name: 'John Martinez',
      role: 'Apprentice Electrician',
      hourlyRate: 45.0,
      avatar: 'JM'
    },
    {
      id: '4',
      name: 'Lisa Chen',
      role: 'Senior Electrician',
      hourlyRate: 75.0,
      avatar: 'LC'
    },
  ];

  // Helper functions
  const ensureNumber = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateSubtotal = (
    laborItems,
    materialItems
  ) => {
    const laborTotal = laborItems.reduce(
      (sum, item) => sum + ensureNumber(item.amount),
      0
    );
    const materialTotal = materialItems.reduce(
      (sum, item) => sum + ensureNumber(item.amount),
      0
    );
    return laborTotal + materialTotal;
  };

  // Initialize invoice state
  const [invoice, setInvoice] = useState(() => {
    const initialLaborItems = [
      {
        id: '1',
        type: 'labor',
        qty: 2.5,
        item: 'Electrical Installation Work',
        description: 'TIME AND MATERIAL TO INSTALL TIMER\nDENNIS H-11-24\nTIMER PROVIDED',
        rate: 85.0,
        amount: 212.5,
        laborName: 'Sarah Johnson',
        laborId: '1',
      },
      {
        id: '2',
        type: 'labor',
        qty: 1.0,
        item: 'Electrical Testing',
        description: 'Testing and verification of electrical connections',
        rate: 65.0,
        amount: 65.0,
        laborName: 'Mike Wilson',
        laborId: '2',
      }
    ];

    const initialMaterialItems = [];
    const initialSubtotal = calculateSubtotal(
      initialLaborItems,
      initialMaterialItems
    );
    const initialPaymentsCredits = -150.0;
    const initialBalanceDue = initialSubtotal + initialPaymentsCredits;

    return {
      id: 'INV-001',
      invoiceNumber: '1116/2024',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      poNumber: 'NOM',
      status: 'draft',
      billTo: {
        name: selectedJob?.customer?.name || 'Fred Olsvold',
        address: selectedJob?.location?.address || '20335 Manor Rd',
        city: 'Deephaven',
        state: 'MN',
        zip: '55391',
      },
      project: selectedJob?.title || '20335 Manor Rd st',
      laborItems: initialLaborItems,
      materialItems: initialMaterialItems,
      subtotal: initialSubtotal,
      paymentsCredits: initialPaymentsCredits,
      balanceDue: initialBalanceDue,
      notes: 'Thank you for your business.',
    };
  });

  // Update invoice field
  const updateInvoiceField = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setInvoice((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setInvoice((prev) => {
        const updatedInvoice = { ...prev, [field]: value };

        if (field === 'paymentsCredits') {
          const paymentsCredits = ensureNumber(value);
          updatedInvoice.paymentsCredits = paymentsCredits;
          updatedInvoice.balanceDue =
            ensureNumber(updatedInvoice.subtotal) + paymentsCredits;
        }

        return updatedInvoice;
      });
    }
  };

  // Update invoice item
  const updateInvoiceItem = (
    itemId,
    field,
    value,
    itemType
  ) => {
    setInvoice((prev) => {
      const itemsKey = itemType === 'labor' ? 'laborItems' : 'materialItems';
      const updatedItems = prev[itemsKey].map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          if (field === 'laborId' && itemType === 'labor') {
            const worker = availableWorkers.find((w) => w.id === value);
            if (worker) {
              updatedItem.laborName = worker.name;
              updatedItem.rate = worker.hourlyRate;
              updatedItem.amount =
                ensureNumber(updatedItem.qty) * worker.hourlyRate;
            }
          } else if (field === 'qty' || field === 'rate') {
            const qty =
              field === 'qty'
                ? ensureNumber(value)
                : ensureNumber(updatedItem.qty);
            const rate =
              field === 'rate'
                ? ensureNumber(value)
                : ensureNumber(updatedItem.rate);
            updatedItem.qty = qty;
            updatedItem.rate = rate;
            updatedItem.amount = qty * rate;
          }

          return updatedItem;
        }
        return item;
      });

      const newSubtotal = calculateSubtotal(
        itemType === 'labor' ? updatedItems : prev.laborItems,
        itemType === 'material' ? updatedItems : prev.materialItems
      );

      return {
        ...prev,
        [itemsKey]: updatedItems,
        subtotal: newSubtotal,
        balanceDue: newSubtotal + ensureNumber(prev.paymentsCredits),
      };
    });
  };

  // Add new item
  const addNewItem = (type) => {
    const newItem = {
      id: `${type}-${Date.now()}`,
      type,
      qty: 1,
      item: type === 'labor' ? 'Labor Work' : 'Material',
      description: '',
      rate: type === 'labor' ? 65.0 : 0,
      amount: type === 'labor' ? 65.0 : 0,
      laborName: type === 'labor' ? undefined : undefined,
      laborId: type === 'labor' ? undefined : undefined,
    };

    setInvoice((prev) => {
      const itemsKey = type === 'labor' ? 'laborItems' : 'materialItems';
      const updatedItems = [...prev[itemsKey], newItem];
      const newSubtotal = calculateSubtotal(
        type === 'labor' ? updatedItems : prev.laborItems,
        type === 'material' ? updatedItems : prev.materialItems
      );

      return {
        ...prev,
        [itemsKey]: updatedItems,
        subtotal: newSubtotal,
        balanceDue: newSubtotal + ensureNumber(prev.paymentsCredits),
      };
    });
  };

  // Remove item
  const removeItem = (itemId, itemType) => {
    setInvoice((prev) => {
      const itemsKey = itemType === 'labor' ? 'laborItems' : 'materialItems';
      const updatedItems = prev[itemsKey].filter((item) => item.id !== itemId);
      const newSubtotal = calculateSubtotal(
        itemType === 'labor' ? updatedItems : prev.laborItems,
        itemType === 'material' ? updatedItems : prev.materialItems
      );

      return {
        ...prev,
        [itemsKey]: updatedItems,
        subtotal: newSubtotal,
        balanceDue: newSubtotal + ensureNumber(prev.paymentsCredits),
      };
    });
  };

  // Navigation handlers
  const proceedToPreview = () => {
    if (
      invoice.laborItems.length === 0 &&
      invoice.materialItems.length === 0
    ) {
      Alert.alert(
        'Missing Items',
        'Please add at least one labor or material item to the invoice'
      );
      return;
    }
    if (!invoice.billTo.name.trim()) {
      Alert.alert('Missing Information', 'Please enter customer information');
      return;
    }
    setCurrentStep(2);
  };

  const goBackToEdit = () => {
    setCurrentStep(1);
  };

  const handleSendInvoice = () => {
    setLoading(true);
    setTimeout(() => {
      setInvoice((prev) => ({ ...prev, status: 'sent' }));
      Alert.alert('Success', 'Invoice sent to customer successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setLoading(false);
            navigation.navigate('HomeScreen');
          },
        },
      ]);
    }, 2000);
  };

  const handleDownloadInvoice = () => {
    Alert.alert('Success', 'Invoice downloaded successfully!');
  };

  // Render labor item form
  const renderLaborItemForm = (items) => (
    <View style={styles.itemsContainer}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.laborItemCard}>
          <View style={styles.itemHeader}>
            <View style={styles.itemHeaderLeft}>
              <Ionicons name="time" size={16} color={COLORS.primary} />
              <Text style={styles.itemHeaderTitle}>
                Labor Entry {index + 1}
              </Text>
            </View>
            {items.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id, 'labor')}
              >
                <Ionicons name="remove-circle" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </View>

          {/* Worker Selection Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Worker</Text>
            <WorkerDropdown
              selectedWorkerId={item.laborId}
              workers={availableWorkers}
              onSelect={(workerId) => 
                updateInvoiceItem(item.id, 'laborId', workerId, 'labor')
              }
              placeholder="Choose a worker"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Hours Worked</Text>
              <TextInput
                style={styles.input}
                value={item.qty.toString()}
                onChangeText={(text) =>
                  updateInvoiceItem(
                    item.id,
                    'qty',
                    parseFloat(text) || 0,
                    'labor'
                  )
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Rate/Hour ($)</Text>
              <TextInput
                style={styles.input}
                value={item.rate.toString()}
                onChangeText={(text) =>
                  updateInvoiceItem(
                    item.id,
                    'rate',
                    parseFloat(text) || 0,
                    'labor'
                  )
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Service Description</Text>
            <TextInput
              style={styles.input}
              value={item.item}
              onChangeText={(text) =>
                updateInvoiceItem(item.id, 'item', text, 'labor')
              }
              placeholder="Service performed"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Work Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(text) =>
                updateInvoiceItem(item.id, 'description', text, 'labor')
              }
              placeholder="Detailed work description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.laborSummary}>
            <View style={styles.laborSummaryRow}>
              <Text style={styles.laborSummaryLabel}>
                Worker: {item.laborName || 'Not selected'}
              </Text>
              <Text style={styles.laborSummaryAmount}>
                Amount: ${ensureNumber(item.amount).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addNewItem('labor')}
      >
        <Ionicons name="add-circle" size={20} color={COLORS.primary} />
        <Text style={styles.addButtonText}>Add Labor Entry</Text>
      </TouchableOpacity>
    </View>
  );

  // Render material item form
  const renderMaterialItemForm = (items) => (
    <View style={styles.itemsContainer}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.materialItemCard}>
          <View style={styles.itemHeader}>
            <View style={styles.itemHeaderLeft}>
              <Ionicons name="cube" size={16} color={COLORS.success} />
              <Text style={styles.itemHeaderTitle}>
                Material {index + 1}
              </Text>
            </View>
            {items.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id, 'material')}
              >
                <Ionicons name="remove-circle" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={item.qty.toString()}
                onChangeText={(text) =>
                  updateInvoiceItem(
                    item.id,
                    'qty',
                    parseFloat(text) || 0,
                    'material'
                  )
                }
                keyboardType="numeric"
                placeholder="1"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Rate/Unit ($)</Text>
              <TextInput
                style={styles.input}
                value={item.rate.toString()}
                onChangeText={(text) =>
                  updateInvoiceItem(
                    item.id,
                    'rate',
                    parseFloat(text) || 0,
                    'material'
                  )
                }
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Item Name</Text>
            <TextInput
              style={styles.input}
              value={item.item}
              onChangeText={(text) =>
                updateInvoiceItem(item.id, 'item', text, 'material')
              }
              placeholder="Material name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(text) =>
                updateInvoiceItem(item.id, 'description', text, 'material')
              }
              placeholder="Material specifications"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.materialSummary}>
            <Text style={styles.materialSummaryAmount}>
              Amount: ${ensureNumber(item.amount).toFixed(2)}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addNewItem('material')}
      >
        <Ionicons name="add-circle" size={20} color={COLORS.success} />
        <Text style={styles.addButtonText}>Add Material Item</Text>
      </TouchableOpacity>
    </View>
  );

  // Render data entry step
  const renderDataEntry = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Invoice Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Invoice Information</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Invoice Number</Text>
              <TextInput
                style={styles.input}
                value={invoice.invoiceNumber}
                onChangeText={(text) =>
                  updateInvoiceField('invoiceNumber', text)
                }
                placeholder="Invoice #"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={invoice.date}
                onChangeText={(text) => updateInvoiceField('date', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={invoice.dueDate}
                onChangeText={(text) => updateInvoiceField('dueDate', text)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>P.O. Number</Text>
              <TextInput
                style={styles.input}
                value={invoice.poNumber}
                onChangeText={(text) => updateInvoiceField('poNumber', text)}
                placeholder="P.O. Number"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Project</Text>
            <TextInput
              style={styles.input}
              value={invoice.project}
              onChangeText={(text) => updateInvoiceField('project', text)}
              placeholder="Project description"
            />
          </View>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Bill To</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Customer Name</Text>
            <TextInput
              style={styles.input}
              value={invoice.billTo.name}
              onChangeText={(text) => updateInvoiceField('billTo.name', text)}
              placeholder="Customer name"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              value={invoice.billTo.address}
              onChangeText={(text) =>
                updateInvoiceField('billTo.address', text)
              }
              placeholder="Street address"
            />
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputThird}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={invoice.billTo.city}
                onChangeText={(text) => updateInvoiceField('billTo.city', text)}
                placeholder="City"
              />
            </View>
            <View style={styles.inputThird}>
              <Text style={styles.inputLabel}>State</Text>
              <TextInput
                style={styles.input}
                value={invoice.billTo.state}
                onChangeText={(text) =>
                  updateInvoiceField('billTo.state', text)
                }
                placeholder="State"
              />
            </View>
            <View style={styles.inputThird}>
              <Text style={styles.inputLabel}>ZIP</Text>
              <TextInput
                style={styles.input}
                value={invoice.billTo.zip}
                onChangeText={(text) => updateInvoiceField('billTo.zip', text)}
                placeholder="ZIP"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Labor & Materials */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="construct" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Labor & Materials</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'labor' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('labor')}
          >
            <Ionicons
              name="time"
              size={16}
              color={activeTab === 'labor' ? COLORS.white : COLORS.gray600}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'labor' && styles.tabTextActive,
              ]}
            >
              Labor ({invoice.laborItems.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'material' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('material')}
          >
            <Ionicons
              name="cube"
              size={16}
              color={activeTab === 'material' ? COLORS.white : COLORS.gray600}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'material' && styles.tabTextActive,
              ]}
            >
              Materials ({invoice.materialItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'labor'
          ? renderLaborItemForm(invoice.laborItems)
          : renderMaterialItemForm(invoice.materialItems)}
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="card" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Payment Information</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Payments/Credits</Text>
            <TextInput
              style={styles.input}
              value={invoice.paymentsCredits.toString()}
              onChangeText={(text) =>
                updateInvoiceField('paymentsCredits', parseFloat(text) || 0)
              }
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={invoice.notes}
              onChangeText={(text) => updateInvoiceField('notes', text)}
              placeholder="Additional notes or terms"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Labor Total:</Text>
            <Text style={styles.summaryValue}>
              $
              {invoice.laborItems
                .reduce((sum, item) => sum + ensureNumber(item.amount), 0)
                .toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Materials Total:</Text>
            <Text style={styles.summaryValue}>
              $
              {invoice.materialItems
                .reduce((sum, item) => sum + ensureNumber(item.amount), 0)
                .toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValueBold}>
              ${invoice.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payments/Credits:</Text>
            <Text style={styles.summaryValue}>
              ${invoice.paymentsCredits.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowTotal]}>
            <Text style={styles.summaryLabelTotal}>Balance Due:</Text>
            <Text style={styles.summaryValueTotal}>
              ${invoice.balanceDue.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // Render preview step
  const renderPreview = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Invoice Preview</Text>

        {/* Invoice Header */}
        <View style={styles.previewHeader}>
          <Text style={styles.companyName}>JDP Electrics</Text>
          <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
        </View>

        {/* Bill To */}
        <View style={styles.previewSection}>
          <Text style={styles.previewSectionTitle}>Bill To:</Text>
          <Text style={styles.previewText}>{invoice.billTo.name}</Text>
          <Text style={styles.previewText}>{invoice.billTo.address}</Text>
          <Text style={styles.previewText}>
            {invoice.billTo.city}, {invoice.billTo.state} {invoice.billTo.zip}
          </Text>
        </View>

        {/* Project & Dates */}
        <View style={styles.previewSection}>
          <View style={styles.previewRow}>
            <View style={styles.previewColumn}>
              <Text style={styles.previewLabel}>Project:</Text>
              <Text style={styles.previewText}>{invoice.project}</Text>
            </View>
            <View style={styles.previewColumn}>
              <Text style={styles.previewLabel}>Date:</Text>
              <Text style={styles.previewText}>{invoice.date}</Text>
            </View>
          </View>
          <View style={styles.previewRow}>
            <View style={styles.previewColumn}>
              <Text style={styles.previewLabel}>P.O. Number:</Text>
              <Text style={styles.previewText}>{invoice.poNumber}</Text>
            </View>
            <View style={styles.previewColumn}>
              <Text style={styles.previewLabel}>Due Date:</Text>
              <Text style={styles.previewText}>{invoice.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Items */}
        {invoice.laborItems.length > 0 && (
          <View style={styles.previewSection}>
            <Text style={styles.previewSectionTitle}>Labor Items:</Text>
            {invoice.laborItems.map((item, index) => (
              <View key={item.id} style={styles.previewItem}>
                <Text style={styles.previewItemTitle}>{item.item}</Text>
                <Text style={styles.previewItemDescription}>
                  {item.description}
                </Text>
                <View style={styles.previewItemDetails}>
                  <Text style={styles.previewItemDetail}>
                    {item.qty} hrs × ${item.rate.toFixed(2)}
                  </Text>
                  <Text style={styles.previewItemAmount}>
                    ${item.amount.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.previewItemWorker}>
                  Worker: {item.laborName || 'Not assigned'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {invoice.materialItems.length > 0 && (
          <View style={styles.previewSection}>
            <Text style={styles.previewSectionTitle}>Material Items:</Text>
            {invoice.materialItems.map((item, index) => (
              <View key={item.id} style={styles.previewItem}>
                <Text style={styles.previewItemTitle}>{item.item}</Text>
                <Text style={styles.previewItemDescription}>
                  {item.description}
                </Text>
                <View style={styles.previewItemDetails}>
                  <Text style={styles.previewItemDetail}>
                    {item.qty} × ${item.rate.toFixed(2)}
                  </Text>
                  <Text style={styles.previewItemAmount}>
                    ${item.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Totals */}
        <View style={styles.previewTotals}>
          <View style={styles.previewTotalRow}>
            <Text style={styles.previewTotalLabel}>Subtotal:</Text>
            <Text style={styles.previewTotalValue}>
              ${invoice.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.previewTotalRow}>
            <Text style={styles.previewTotalLabel}>Payments/Credits:</Text>
            <Text style={styles.previewTotalValue}>
              ${invoice.paymentsCredits.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.previewTotalRow, styles.previewTotalRowFinal]}>
            <Text style={styles.previewTotalLabelFinal}>Balance Due:</Text>
            <Text style={styles.previewTotalValueFinal}>
              ${invoice.balanceDue.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.previewSection}>
            <Text style={styles.previewSectionTitle}>Notes:</Text>
            <Text style={styles.previewText}>{invoice.notes}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={
            currentStep === 1 ? () => navigation.navigate('HomeScreen') : goBackToEdit
          }
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {currentStep === 1 ? 'Create Invoice' : 'Invoice Preview'}
          </Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep} of 2{' '}
            {currentStep === 1 ? '• Enter Details' : '• Review & Send'}
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {currentStep === 1 ? renderDataEntry() : renderPreview()}

        {/* Bottom Action Bar */}
        <View style={styles.bottomBar}>
          {currentStep === 1 ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={proceedToPreview}
            >
              <Text style={styles.primaryButtonText}>Continue to Preview</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleDownloadInvoice}
              >
                <Ionicons name="download" size={18} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  styles.sendButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSendInvoice}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.primaryButtonText}>Sending...</Text>
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send Invoice</Text>
                    <Ionicons name="send" size={18} color={COLORS.white} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.black,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputThird: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray700,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.gray900,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // Dropdown Styles
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    minHeight: 44,
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  selectedWorkerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatarSmall: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  workerAvatarTextSmall: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  selectedWorkerInfo: {
    flex: 1,
  },
  selectedWorkerName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray900,
  },
  selectedWorkerDetails: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  modalCloseButton: {
    padding: 4,
  },
  workerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  workerOptionSelected: {
    backgroundColor: COLORS.blue50,
  },
  workerOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatar: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workerAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  workerOptionInfo: {
    flex: 1,
  },
  workerOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray900,
    marginBottom: 2,
  },
  workerOptionRole: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 2,
  },
  workerOptionRate: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray600,
    marginLeft: 6,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  laborItemCard: {
    backgroundColor: COLORS.blue50,
    borderWidth: 1,
    borderColor: COLORS.blue100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  materialItemCard: {
    backgroundColor: COLORS.green50,
    borderWidth: 1,
    borderColor: COLORS.green100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginLeft: 8,
  },
  removeButton: {
    padding: 4,
  },
  laborSummary: {
    backgroundColor: COLORS.blue100,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  laborSummaryRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  laborSummaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  laborSummaryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  materialSummary: {
    backgroundColor: COLORS.green100,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'flex-end',
  },
  materialSummaryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: COLORS.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryRowTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: 12,
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray900,
  },
  summaryValueBold: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight:'700',
    color: COLORS.primary,
  },
  previewCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight:'700',
    color: COLORS.gray900,
    textAlign: 'center',
    marginBottom: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  companyName: {
    fontSize: 24,
    fontWeight:'700',
    color: COLORS.primary,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray600,
  },
  previewSection: {
    marginBottom: 20,
  },
  previewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  previewColumn: {
    flex: 1,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray500,
    marginBottom: 2,
  },
  previewText: {
    fontSize: 14,
    color: COLORS.gray800,
    lineHeight: 20,
  },
  previewItem: {
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  previewItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  previewItemDescription: {
    fontSize: 12,
    color: COLORS.gray600,
    marginBottom: 6,
  },
  previewItemDetails: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  previewItemDetail: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  previewItemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  previewItemWorker: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
  },
  previewTotals: {
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  previewTotalRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  previewTotalRowFinal: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    paddingTop: 12,
    marginTop: 8,
  },
  previewTotalLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  previewTotalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray900,
  },
  previewTotalLabelFinal: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  previewTotalValueFinal: {
    fontSize: 18,
    fontWeight:'700',
    color: COLORS.primary,
  },
  bottomBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sendButton: {
    flex: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
};

export default InvoiceManagementScreen;